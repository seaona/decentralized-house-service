pragma solidity >=0.4.21 <0.6.0;
import "./ERC721MintableComplete.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier {
    function verifyTx(
        uint[2] memory A,
        uint[2] memory A_p,
        uint[2][2] memory B,
        uint[2] memory B_p,
        uint[2] memory C,
        uint[2] memory C_p,
        uint[2] memory H,
        uint[2] memory K,
        uint[2] memory input
    )
    public
    returns
    (bool r);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {
    SquareVerifier private verifierContract;
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256     index;
        address     addr;
        bool        minted;
    }

    // TODO define an array of the above struct
    uint256 numberOfSolutions = 0;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) uniqueSolutions;


    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 solution_index, address indexed solution_address);

    constructor(address verifierAddress)
        ERC721MintableComplete("Udacity Token", "UDA123")
        public  {
        verifierContract = SquareVerifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
        uint[2] memory A,
        uint[2] memory A_p,
        uint[2][2] memory B,
        uint[2] memory B_p,
        uint[2] memory C,
        uint[2] memory C_p,
        uint[2] memory H,
        uint[2] memory K,
        uint[2] memory input
    ) 
        public 
    {
        bytes32 solutionHash = keccak256(abi.encodePacked(input[0], input[1]));
        require(uniqueSolutions[solutionHash].addr == address(0), "Solution exists already");
        
        bool verified = verifierContract.verifyTx(A, A_p, B, B_p, C, C_p, H, K, input);
        require(verified, "Solution could not be verified");

        uniqueSolutions[solutionHash] = Solution(numberOfSolutions, msg.sender, false);
        emit SolutionAdded(numberOfSolutions, msg.sender);
        numberOfSolutions++;
        
    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

    function mintNewNFT(uint a, uint b, address to) public {
        bytes32 solutionHash = keccak256(abi.encodePacked(a, b));
        require(uniqueSolutions[solutionHash].addr != address(0), "Solution doesn't exist!");
        require(uniqueSolutions[solutionHash].minted == false, "Token is already minted for this solution!");
        require(uniqueSolutions[solutionHash].addr == msg.sender, "Only the solution address can use it to mint a token");
        super.mint(to, uniqueSolutions[solutionHash].index);
        uniqueSolutions[solutionHash].minted = true;
    }

}
























