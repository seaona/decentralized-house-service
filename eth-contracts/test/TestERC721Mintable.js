const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');
const ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    // Constructor variables
    const name = "UdacityToken";
    const symbol = "UDA123";
    const baseTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    let currentOwner;
    let contractInstance;

    describe('match erc721 spec', function () {

        beforeEach(async function () { 
            contractInstance = await ERC721MintableComplete.new(name, symbol, {from: account_one});

            // TODO: mint multiple tokens
            for (let i = 1; i <= 25; i++) {
                if (i < 11) {
                    await contractInstance.mint(account_one, i, {from: account_one});
                }
                
                else {
                    await contractInstance.mint(account_two, i, {from: account_one});
                }
            }
        })

      it('should return total supply', async function () { 
            const totalSupply = await contractInstance.totalSupply.call({from: account_one});
            expect(Number(totalSupply)).to.equal(25);
        })

        it('should get token balance', async function () { 
            const account1Balance = await contractInstance.balanceOf(account_one);
            expect(Number(account1Balance)).to.equal(10);

            const account2Balance = await contractInstance.balanceOf(account_two);     
            expect(Number(account2Balance)).to.equal(15);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURI_no1 = await contractInstance.tokenURI(1);
            let tokenURI_no7 = await contractInstance.tokenURI(7);

            assert.equal(tokenURI_no1, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Token URI of token number 1 has not been set correctly.");
            assert.equal(tokenURI_no7, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/7", "Token URI of token number 7 has not been set correctly.");
         })

        it('should transfer token from one owner to another', async function () { 
            await contractInstance.transferFrom(account_one, account_two, 5);
            let token5_owner = await contractInstance.ownerOf(5);

            assert.equal(token5_owner, account_two, "Token 5 has not been transferred correctly.");  })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            contractInstance = await ERC721MintableComplete.new(name, symbol, {from: account_one});
        })

       it('should fail when minting when address is not contract owner', async function () { 
            await truffleAssert.fails(contractInstance.mint(account_one, 50, {from: account_two}));
        })

        it('should return contract owner', async function () { 
            expect(await contractInstance.getOwner({from: account_two})).to.equal(accounts[0]);
        })

    });
})