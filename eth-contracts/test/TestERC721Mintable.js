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
        const tokensIds = [1, 2, 3, 4, 5, 6, 7];

        beforeEach(async function () { 
            contractInstance = await contractDefinition.new(name, symbol, {from: account_one});

            // TODO: mint multiple tokens
            for (let i=0; i<tokensIds.length-1; i++) {
                await contractInstance.mint(accounts[i+1], tokensIds[tokensIds.length-1], {from: account_one});
            }

        })

        it('should return total supply', async function () { 
            const totalSupply = await contractInstance.totalSupply.call({from: accounts[9]});
            expect(Number(totalSupply)).to.equal(tokensIds.length);
        })

        it('should get token balance', async function () { 
            const account1Balance = await contractInstance.balanceOf(accounts[1]);
            expect(Number(acc3Balance)).to.equal(1);

            const account2Balance = await contractInstance.balanceOf(accounts[9]);     
            expect(Number(acc9Balance)).to.equal(2);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const token3Uri = await contractInstance.tokenURI(tokensIds[3]); 
            expect(token3Uri).to.deep.equal(`${baseTokenURI}${tokensIds[3]}`);

            const token6Uri = await contractInstance.tokenURI(tokensIds[2]); 
            expect(token6Uri).to.deep.equal(`${baseTokenURI}${tokensIds[2]}`);

            const token9Uri = await contractInstance.tokenURI(tokensIds[1]); 
            expect(token9Uri).to.deep.equal(`${baseTokenURI}${tokensIds[1]}`);
        })

        it('should transfer token from one owner to another', async function () { 
            let tx = await contractInstance.transferFrom(accounts[1], accounts[2], tokensIds[1], {from: accounts[2]});
            truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
                return expect(ev.from).to.deep.equal(accounts[1]) 
                       && expect(ev.to).to.equal(accounts[8])
                       && expect(Number(ev.tokenId)).to.equal(tokensIds[2]);
            });

            expect(await contractInstance.ownerOf(tokensIds[2])).to.equal(accounts[8]);
            expect(Number(await contractInstance.balanceOf(accounts[1]))).to.equal(2);
            expect(Number(await contractInstance.balanceOf(accounts[8]))).to.equal(1);
            expect(await contractInstance.getApproved(tokensIds[2])).to.equal(zeroAddress);
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            await expectToRevert(contractInstance.mint(account_two, 5, {from: account_one}), 'Function caller is not the contract owner');
        })

        it('should return contract owner', async function () { 
            expect(await contractInstance.owner({from: account_two})).to.equal(currentOwner);
        })

    });
})