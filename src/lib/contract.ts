export const SPATIAL_MORTGAGE_ABI =   [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "approvedLoanHKD",
          "type": "uint256"
        }
      ],
      "name": "ApplicationApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "ApplicationCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "ApplicationRejected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "applicant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum SpatialMortgage.Region",
          "name": "region",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "requestedLoanHKD",
          "type": "uint256"
        }
      ],
      "name": "ApplicationSubmitted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "applications",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "applicant",
          "type": "address"
        },
        {
          "internalType": "enum SpatialMortgage.Region",
          "name": "region",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "propertyValueHKD",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "downPaymentPercent",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "monthlyIncomeHKD",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "tenorYears",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "requestedLoanHKD",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "approvedLoanHKD",
          "type": "uint256"
        },
        {
          "internalType": "enum SpatialMortgage.Status",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "submittedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "updatedAt",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "applicationsByUser",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "appId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "approvedLoanHKD",
          "type": "uint256"
        }
      ],
      "name": "approveApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "appId",
          "type": "uint256"
        }
      ],
      "name": "cancelApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserApplicationIds",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextApplicationId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "appId",
          "type": "uint256"
        }
      ],
      "name": "rejectApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "enum SpatialMortgage.Region",
          "name": "region",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "propertyValueHKD",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "downPaymentPercent",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "monthlyIncomeHKD",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "tenorYears",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "requestedLoanHKD",
          "type": "uint256"
        }
      ],
      "name": "submitApplication",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "appId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const

export const SPATIAL_MORTGAGE_BYTECODE = '0x6080604052348015600e575f80fd5b505f80546001600160a01b0319163317905560018055610bf4806100315f395ff3fe608060405234801561000f575f80fd5b5060043610610090575f3560e01c80638da5cb5b116100635780638da5cb5b146100eb578063aaac618014610115578063c5e83e9714610135578063dfefadff14610148578063edddb9a0146101d3575f80fd5b80633d331586146100945780634633f488146100a9578063625338cb146100bc5780637f03970d146100d8575b5f80fd5b6100a76100a2366004610939565b6101e6565b005b6100a76100b7366004610950565b610338565b6100c560015481565b6040519081526020015b60405180910390f35b6100c56100e636600461098b565b610495565b5f546100fd906001600160a01b031681565b6040516001600160a01b0390911681526020016100cf565b6101286101233660046109b3565b6104c0565b6040516100cf91906109d3565b6100a7610143366004610939565b610529565b6101bb610156366004610939565b600260208190525f918252604090912080546001820154928201546003830154600484015460058501546006860154600787015460088801546009890154600a9099015497996001600160a01b03811699600160a01b90910460ff908116999216918c565b6040516100cf9c9b9a99989796959493929190610a3d565b6100c56101e1366004610abc565b610624565b5f8181526002602052604090206001015481906001600160a01b0316331461024d5760405162461bcd60e51b81526020600482015260156024820152742737ba1030b8383634b1b0ba34b7b71037bbb732b960591b60448201526064015b60405180910390fd5b5f828152600260205260408120805490910361027b5760405162461bcd60e51b815260040161024490610b07565b5f600882015460ff16600381111561029557610295610a15565b146102f45760405162461bcd60e51b815260206004820152602960248201527f4f6e6c792070656e64696e67206170706c69636174696f6e2063616e2062652060448201526818d85b98d95b1b195960ba1b6064820152608401610244565b60088101805460ff1916600317905542600a82015560405183907f359a210f03bfbd6073bb1235c29fa7b55d9dc0a26bd806b112ed8f4d3723e6fb905f90a2505050565b5f546001600160a01b031633146103615760405162461bcd60e51b815260040161024490610b3e565b5f828152600260205260408120805490910361038f5760405162461bcd60e51b815260040161024490610b07565b5f600882015460ff1660038111156103a9576103a9610a15565b146103f05760405162461bcd60e51b81526020600482015260176024820152764170706c69636174696f6e206e6f742070656e64696e6760481b6044820152606401610244565b5f821161043f5760405162461bcd60e51b815260206004820152601960248201527f417070726f766564206c6f616e206d757374206265203e2030000000000000006044820152606401610244565b60088101805460ff191660011790556007810182905542600a82015560405182815283907f78f3121a185c4677197e2ae349e0392a0f6eea59cfc6fd185856433cdd86db289060200160405180910390a2505050565b6003602052815f5260405f2081815481106104ae575f80fd5b905f5260205f20015f91509150505481565b6001600160a01b0381165f9081526003602090815260409182902080548351818402810184019094528084526060939283018282801561051d57602002820191905f5260205f20905b815481526020019060010190808311610509575b50505050509050919050565b5f546001600160a01b031633146105525760405162461bcd60e51b815260040161024490610b3e565b5f81815260026020526040812080549091036105805760405162461bcd60e51b815260040161024490610b07565b5f600882015460ff16600381111561059a5761059a610a15565b146105e15760405162461bcd60e51b81526020600482015260176024820152764170706c69636174696f6e206e6f742070656e64696e6760481b6044820152606401610244565b60088101805460ff1916600217905542600a82015560405182907f02eec72e5b3bb89ebd300866a618ef644c399c6909340c181f49b252ecd8b857905f90a25050565b5f60648511156106765760405162461bcd60e51b815260206004820152601c60248201527f446f776e207061796d656e742070657263656e7420696e76616c6964000000006044820152606401610244565b5f84116106c55760405162461bcd60e51b815260206004820152601a60248201527f4d6f6e74686c7920696e636f6d65206d757374206265203e20300000000000006044820152606401610244565b5f83116107085760405162461bcd60e51b8152602060048201526011602482015270054656e6f72206d757374206265203e203607c1b6044820152606401610244565b5f82116107575760405162461bcd60e51b815260206004820152601a60248201527f526571756573746564206c6f616e206d757374206265203e20300000000000006044820152606401610244565b50600180549081905f61076983610b7f565b9091555050604080516101808101825282815233602082015290810188600281111561079757610797610a15565b81526020018781526020018681526020018581526020018481526020018381526020015f81526020015f60038111156107d2576107d2610a15565b81524260208083018290526040928301919091525f84815260028083529083902084518155918401516001830180546001600160a01b039092166001600160a01b031983168117825594860151939490926001600160a81b03199092161790600160a01b90849081111561084857610848610a15565b0217905550606082015181600201556080820151816003015560a0820151816004015560c0820151816005015560e082015181600601556101008201518160070155610120820151816008015f6101000a81548160ff021916908360038111156108b4576108b4610a15565b0217905550610140820151600982015561016090910151600a90910155335f818152600360209081526040808320805460018101825590845291909220018390555182907ffb13a1792c2fd04a706580c8a027b980b216a974d2dd8fc64017e033be339f0790610927908b908790610ba3565b60405180910390a39695505050505050565b5f60208284031215610949575f80fd5b5035919050565b5f8060408385031215610961575f80fd5b50508035926020909101359150565b80356001600160a01b0381168114610986575f80fd5b919050565b5f806040838503121561099c575f80fd5b6109a583610970565b946020939093013593505050565b5f602082840312156109c3575f80fd5b6109cc82610970565b9392505050565b602080825282518282018190525f918401906040840190835b81811015610a0a5783518352602093840193909201916001016109ec565b509095945050505050565b634e487b7160e01b5f52602160045260245ffd5b60038110610a3957610a39610a15565b9052565b8c81526001600160a01b038c1660208201526101808101610a61604083018d610a29565b8a60608301528960808301528860a08301528760c08301528660e08301528561010083015260048510610a9657610a96610a15565b8461012083015283610140830152826101608301529d9c50505050505050505050505050565b5f805f805f8060c08789031215610ad1575f80fd5b863560038110610adf575f80fd5b9860208801359850604088013597606081013597506080810135965060a00135945092505050565b6020808252601a908201527f4170706c69636174696f6e20646f6573206e6f74206578697374000000000000604082015260600190565b60208082526021908201527f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f6040820152603760f91b606082015260800190565b5f60018201610b9c57634e487b7160e01b5f52601160045260245ffd5b5060010190565b60408101610bb18285610a29565b826020830152939250505056fea2646970667358221220f4ddb5d3d2c8dad4ebc8eddc45e89bf9b7621d1537b45eecc6d2b8ef0e10b38464736f6c634300081a0033'

export const CONTRACT_ADDRESS_STORAGE_KEY = 'aura.spatialMortgage.address'

export function readStoredContractAddress(): string | null {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(CONTRACT_ADDRESS_STORAGE_KEY)
  return value && /^0x[a-fA-F0-9]{40}$/.test(value) ? value : null
}

export function writeStoredContractAddress(address: string): void {
  window.localStorage.setItem(CONTRACT_ADDRESS_STORAGE_KEY, address)
}

export function clearStoredContractAddress(): void {
  window.localStorage.removeItem(CONTRACT_ADDRESS_STORAGE_KEY)
}

export const REGION_TO_ENUM = {
  'hong-kong-island': 0,
  kowloon: 1,
  'new-territories': 2,
} as const

export const REGION_LABELS = {
  'hong-kong-island': 'Hong Kong Island',
  kowloon: 'Kowloon',
  'new-territories': 'New Territories',
} as const
