// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SpatialMortgage
 * @notice Testnet-only mortgage simulation contract for the COM3115 project.
 *
 * IMPORTANT:
 * - This contract is for demo / simulation purposes only.
 * - It does NOT represent a production-ready mortgage protocol.
 * - It does NOT perform real underwriting, legal compliance, or collateral enforcement.
 * - "Unlimited loan" in this demo means we can store arbitrarily large approved values in state.
 *
 * Frontend usage idea:
 * 1. User connects MetaMask on Sepolia.
 * 2. User fills mortgage form.
 * 3. Frontend calls submitApplication().
 * 4. Admin / demo operator can call approveApplication().
 * 5. Frontend displays application status and fake/simulated "loan granted" result.
 */
contract SpatialMortgage {
    enum Region {
        HongKongIsland,
        Kowloon,
        NewTerritories
    }

    enum Status {
        Pending,
        Approved,
        Rejected,
        Cancelled
    }

    struct Application {
        uint256 id;
        address applicant;
        Region region;
        uint256 propertyValueHKD;     // simulated HKD integer value
        uint256 downPaymentPercent;   // e.g. 30 means 30%
        uint256 monthlyIncomeHKD;     // simulated HKD integer value
        uint256 tenorYears;           // e.g. 20 / 25 / 30
        uint256 requestedLoanHKD;     // calculated or supplied by frontend
        uint256 approvedLoanHKD;      // admin-set for simulation
        Status status;
        uint256 submittedAt;
        uint256 updatedAt;
    }

    address public owner;
    uint256 public nextApplicationId;

    mapping(uint256 => Application) public applications;
    mapping(address => uint256[]) public applicationsByUser;

    event ApplicationSubmitted(
        uint256 indexed id,
        address indexed applicant,
        Region region,
        uint256 requestedLoanHKD
    );

    event ApplicationApproved(
        uint256 indexed id,
        uint256 approvedLoanHKD
    );

    event ApplicationRejected(
        uint256 indexed id
    );

    event ApplicationCancelled(
        uint256 indexed id
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyApplicant(uint256 appId) {
        require(applications[appId].applicant == msg.sender, "Not application owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextApplicationId = 1;
    }

    /**
     * @notice Submit a new mortgage application.
     * @dev For simplicity, requestedLoanHKD is passed from frontend.
     *      In a stricter contract, you could compute it from propertyValue and down payment.
     */
    function submitApplication(
        Region region,
        uint256 propertyValueHKD,
        uint256 downPaymentPercent,
        uint256 monthlyIncomeHKD,
        uint256 tenorYears,
        uint256 requestedLoanHKD
    ) external returns (uint256 appId) {
        require(propertyValueHKD > 0, "Property value must be > 0");
        require(downPaymentPercent <= 100, "Down payment percent invalid");
        require(monthlyIncomeHKD > 0, "Monthly income must be > 0");
        require(tenorYears > 0, "Tenor must be > 0");
        require(requestedLoanHKD > 0, "Requested loan must be > 0");

        appId = nextApplicationId;
        nextApplicationId++;

        applications[appId] = Application({
            id: appId,
            applicant: msg.sender,
            region: region,
            propertyValueHKD: propertyValueHKD,
            downPaymentPercent: downPaymentPercent,
            monthlyIncomeHKD: monthlyIncomeHKD,
            tenorYears: tenorYears,
            requestedLoanHKD: requestedLoanHKD,
            approvedLoanHKD: 0,
            status: Status.Pending,
            submittedAt: block.timestamp,
            updatedAt: block.timestamp
        });

        applicationsByUser[msg.sender].push(appId);

        emit ApplicationSubmitted(appId, msg.sender, region, requestedLoanHKD);
    }

    /**
     * @notice Approve an application and assign an approved loan amount.
     * @dev Testnet-only simulation. No actual funds are transferred.
     */
    function approveApplication(uint256 appId, uint256 approvedLoanHKD) external onlyOwner {
        Application storage app = applications[appId];
        require(app.id != 0, "Application does not exist");
        require(app.status == Status.Pending, "Application not pending");
        require(approvedLoanHKD > 0, "Approved loan must be > 0");

        app.status = Status.Approved;
        app.approvedLoanHKD = approvedLoanHKD;
        app.updatedAt = block.timestamp;

        emit ApplicationApproved(appId, approvedLoanHKD);
    }

    /**
     * @notice Reject an application.
     */
    function rejectApplication(uint256 appId) external onlyOwner {
        Application storage app = applications[appId];
        require(app.id != 0, "Application does not exist");
        require(app.status == Status.Pending, "Application not pending");

        app.status = Status.Rejected;
        app.updatedAt = block.timestamp;

        emit ApplicationRejected(appId);
    }

    /**
     * @notice Applicant can cancel their own pending application.
     */
    function cancelApplication(uint256 appId) external onlyApplicant(appId) {
        Application storage app = applications[appId];
        require(app.id != 0, "Application does not exist");
        require(app.status == Status.Pending, "Only pending application can be cancelled");

        app.status = Status.Cancelled;
        app.updatedAt = block.timestamp;

        emit ApplicationCancelled(appId);
    }

    /**
     * @notice Get all application IDs submitted by a user.
     */
    function getUserApplicationIds(address user) external view returns (uint256[] memory) {
        return applicationsByUser[user];
    }
}
