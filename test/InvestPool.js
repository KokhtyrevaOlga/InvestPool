const web3 = global.web3;
const InvestPool = artifacts.require('./InvestPool.sol');
const SimpleTokenCoin = artifacts.require('./Project.sol')

contract('InvestPool', function (accounts) {
	
	let projectAddress
	let project
	
	beforeEach('setup project contract for each test', async function() {
		project = await SimpleTokenCoin.new();
		projectAddress = await project.address;
	});
	
    let pool
	
	//create new smart contract instance before each test method
    beforeEach('setup contract for each test', async function() {
        pool = await InvestPool.new(...Object.values ({
			_projectAddress: projectAddress,
			_maxTotalAmount: 100,
			_minTotalAmount: 10,
			_maxTotalAmountForOne: 50,
			_minTotalAmountForOne: 5,
			_poolCommision: 2,
			_icoWorldCommision: 2,
			_poolOwner: accounts[1],
			_start: 1535587200,
			_period: 30,
			_criticalDate: 1539129600
	}), 
	{from: accounts[9]});
    });
	
	it("should set initial attributes", async function() {
		assert.equal(await pool.projectAddress(), projectAddress);
		assert.equal(await pool.maxTotalAmount(), 100);
		assert.equal(await pool.minTotalAmount(), 10);
		assert.equal(await pool.maxTotalAmountForOne(), 50);
		assert.equal(await pool.minTotalAmountForOne(), 5);
		assert.equal(await pool.poolCommision(), 2);
		assert.equal(await pool.icoWorldCommision(), 2);
		assert.equal(await pool.poolOwner(), accounts[1]);
		assert.equal(await pool.start(), 1535587200);
        assert.equal(await pool.period(), 30);
		assert.equal(await pool.criticalDate(), 1539129600);
    });
	
	it("should get pool commision", async function() {
		assert.equal(await pool.getPoolCommision(), 2);	
	});
	
	it('invest the correct amounts in the pool', async function () {
		const poolAddress = await pool.address;
		const poolOwner = await pool.poolOwner();
		const icoWorldAddress = await pool.icoWorldAddress();
		
		assert.equal(web3.eth.getBalance(poolAddress).toNumber(), 0);
		let balanceIcoWorldAddress = web3.eth.getBalance(icoWorldAddress).toNumber();
		let balanceProjectAddress = web3.eth.getBalance(projectAddress).toNumber();
		//accounts[2] 10 eth
        await pool.sendTransaction({ value: 10, from: accounts[2]});
        assert.equal(web3.eth.getBalance(poolAddress).toNumber(), 10);
		assert.equal(await pool.balance(), 10);
		assert.equal(await pool.getAddressByNumber(0), accounts[2]);
		data = await pool.getData(accounts[2], {from: accounts[2]});
		assert.equal(data, 10)
		//accounts[3] 20 eth
		await pool.sendTransaction({ value: 20, from: accounts[3]});
        assert.equal(web3.eth.getBalance(poolAddress).toNumber(), 30);
		assert.equal(await pool.balance(), 30);
		assert.equal(await pool.getAddressByNumber(1), accounts[3]);
		data = await pool.getData(accounts[3], {from: accounts[3]});
		assert.equal(data, 20)
		//accounts[4] 30 eth
		await pool.sendTransaction({ value: 30, from: accounts[4]});
        assert.equal(web3.eth.getBalance(poolAddress).toNumber(), 60);
		assert.equal(await pool.balance(), 60);
		assert.equal(await pool.getAddressByNumber(2), accounts[4]);
		data = await pool.getData(accounts[4], {from: accounts[4]});
		assert.equal(data, 30)
		//investing
		//await pool.investProject({value: 0, from: poolOwner});
    })
	
	
})