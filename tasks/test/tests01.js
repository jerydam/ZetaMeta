const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('ERC20 Tokens Exercise 1', function () {
    
    let deployer, user1, user2, user3;

    // Constants 
    const DEPLOYER_MINT = ethers.utils.parseEther('100000');
    const USERS_MINT = ethers.utils.parseEther('5000');
    const FIRST_TRANSFER = ethers.utils.parseEther('100');
    const SECOND_TRANSFER = ethers.utils.parseEther('1000');

    before(async function () {
        /** Deployment and minting tests */
        
        [deployer, user1, user2, user3] = await ethers.getSigners();

        // TODO: Contract deployment
        const asmau = await ethers.getContractFactory("ASMAU", deployer);
        // const asmauSigner = asmau.connect(deployer);
        this.asm = await asmau.deploy();
        // await ASMAU.deployed();

        // TODO: Minting
        await this.asm.mint(deployer.address, DEPLOYER_MINT);
        await this.asm.mint(user1.address, USERS_MINT);
        await this.asm.mint(user2.address, USERS_MINT);
        await this.asm.mint(user3.address, USERS_MINT);
        
        // TODO: Check Minting
        expect(await this.asm.balanceOf(deployer.address)).to.equal(DEPLOYER_MINT);
        expect(await this.asm.balanceOf(user2.address)).to.equal(USERS_MINT);
        
    });
    
    it('Transfer tests', async function () {
        /** Transfers Tests */
        
        // TODO: First transfer
        await this.asm.connect(user2).transfer(user3.address, FIRST_TRANSFER);
        
        // TODO: Approval & Allowance test
        await this.asm.connect(user3).approve(user1.address, SECOND_TRANSFER);
        expect(await this.asm.allowance(user3.address, user1.address)).to.equal(SECOND_TRANSFER);
        
        // TODO: Second transfer
        await this.asm.connect(user1).transferFrom(user3.address, user1.address, SECOND_TRANSFER);
        
        // TODO: Checking balances after transfer
        expect(await this.asm.balanceOf(user1.address)).to.equal(USERS_MINT.add(SECOND_TRANSFER));
        expect(await this.asm.balanceOf(user2.address)).to.equal(USERS_MINT.sub(FIRST_TRANSFER));
        expect(await this.asm.balanceOf(user3.address)).to.equal(USERS_MINT.add(FIRST_TRANSFER).sub(SECOND_TRANSFER));
        
    });
});
