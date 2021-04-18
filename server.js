const { json } = require('express');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Product = require('./models/product');
const MONGODB_URI =
	process.env.MONGODB_URI ||
	'mongodb+srv://indy:testdatabase@cluster0.bhxcn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT || 9000;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
	console.error('MongoDB error', err);
});
app.use(express.json());
// eth method
const { ethers } = require('ethers');
const exec = {
	async claimableReward(number) {
		const provider = new ethers.providers.JsonRpcProvider(
			'https://kovan.infura.io/v3/15ce6797248643989c8b2b44aa15df19'
		);
		const contract = new ethers.Contract(
			'0xDe2e130722bdC3322ad2323Ac45e888a7Df58c59',
			require('./abis/ExternalLottery.json'),
			provider
		);

		const signer = new ethers.Wallet(
			'0xa6605fb3ced01024a51c59bc984e33ef6f418bae237bc2d766d36555fd858aea',
			provider
		);
		const contractWithSigner = contract.connect(signer);
		const result = await contractWithSigner.claimableReward(number);
		console.log(result);
	},
	async setClaimableReward(rank, reward) {
		const provider = new ethers.providers.JsonRpcProvider(
			'https://kovan.infura.io/v3/15ce6797248643989c8b2b44aa15df19'
		);
		const contract = new ethers.Contract(
			'0xDe2e130722bdC3322ad2323Ac45e888a7Df58c59',
			require('./abis/ExternalLottery.json'),
			provider
		);
		const signer = new ethers.Wallet(
			'0xa6605fb3ced01024a51c59bc984e33ef6f418bae237bc2d766d36555fd858aea',
			provider
		);
		const contractWithSigner = contract.connect(signer);
		const result = await contractWithSigner.setClaimableReward(
			rank,
			reward
		);
		console.log(result);
	},
	async setRewardNumber(rank, data) {
		const provider = new ethers.providers.JsonRpcProvider(
			'https://kovan.infura.io/v3/15ce6797248643989c8b2b44aa15df19'
		);
		const contract = new ethers.Contract(
			'0xDe2e130722bdC3322ad2323Ac45e888a7Df58c59',
			require('./abis/ExternalLottery.json'),
			provider
		);
		const signer = new ethers.Wallet(
			'0xa6605fb3ced01024a51c59bc984e33ef6f418bae237bc2d766d36555fd858aea',
			provider
		);
		const contractWithSigner = contract.connect(signer);
		const result = await contractWithSigner.setRewardNumber(rank, data);
		console.log(result);
		return result
	},
	async rewardNumbers(x, y) {
		const provider = new ethers.providers.JsonRpcProvider(
			'https://kovan.infura.io/v3/15ce6797248643989c8b2b44aa15df19'
		);
		const contract = new ethers.Contract(
			'0xDe2e130722bdC3322ad2323Ac45e888a7Df58c59',
			require('./abis/ExternalLottery.json'),
			provider
		);
		const signer = new ethers.Wallet(
			'0xa6605fb3ced01024a51c59bc984e33ef6f418bae237bc2d766d36555fd858aea',
			provider
		);
		const contractWithSigner = contract.connect(signer);
		const result = await contractWithSigner.rewardNumbers(x, y);
		console.log(y);
		console.log(result);
	},
};
//get method
app.get('/', async (req, res) => {
	const mas =
		'1./products : เรียกข้อมุลทั้งหมด ไม่กรอง  2./products/lotto เรียกข้อมุลทั้งหมด กรอง 3./products/:id เรียกตา id 4./products/R/:Rank1 เรียกตามอันดับ 5./products/Dateonly/:Date1 เรียกตามในที่ออก กรอง 6./products/Dateall/:Date1 ไม่กรอง ';
	exec.claimableReward(0);
	res.json(mas);
});
app.get('/products', async (req, res) => {
	const products = await Product.find({});
	var i;
	for (i = 0; i < 18; i++) {
		exec.rewardNumbers(1, i);
	}
	// res.json(products);
});
app.get('/products/lotto', async (req, res) => {
	const products = await Product.find({});
	const out1 = [];
	for (x in products) {
		const obj = {};
		newNum = products[x].Data;
		newVal = products[x].Rank;
		obj[newVal] = newNum;
		out1.push(obj);
	}
	res.json(out1);
});
app.get('/products/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const product = await Product.findById(id);
		res.json(product);
	} catch (error) {
		res.status(400).json(error);
	}
});
app.get('/products/R/:Rank1', async (req, res) => {
	const { Rank1 } = req.params;
	try {
		const products = await Product.find({ Rank: Rank1 });
		const out1 = [];
		const obj = {};
		newNum = products[0].Rank;
		newVal = products[0].Award;
		obj[newNum] = newVal;
		exec.setClaimableReward(parseInt(newNum), parseInt(newVal));
		out1.push(obj);
		res.json(out1);
	} catch (error) {
		res.status(400).json(error);
	}
});
app.get('/products/Rall/:Rank1', async (req, res) => {
	const { Rank1 } = req.params;
	try {
		const products = await Product.find({ Rank: Rank1 });
		const out1 = [];
		for (x in products) {
			const obj = {};
			newNum = products[x].Data;
			newVal = products[x].Rank;
			obj[newVal] = newNum;
			out1.push(obj);
		}
		res.json(out1);
	} catch (error) {
		res.status(400).json(error);
	}
});
app.get('/products/Dateonly/:Date1', async (req, res) => {
	const { Date1 } = req.params;
	try {
		const products = await Product.find({ Date: Date1 });
		const out1 = [];
		for (x in products) {
			const obj = {};
			newNum = products[x].Data;
			newVal = products[x].Rank;
			obj[newVal] = newNum;
			out1.push(obj);
		}
		res.json(out1);
	} catch (error) {
		res.status(400).json(error);
	}
});
app.get('/products/Dateall/:Date1', async (req, res) => {
	const { Date1 } = req.params;
	try {
		const products = await Product.find({ Date: Date1 });
		res.json(products);
	} catch (error) {
		res.status(400).json(error);
	}
});
app.get('/products/postReward/:Date1', async (req, res) => {
	const { Date1 } = req.params;
	const products = await Product.find({ Date: Date1 });
	var num = 0;
	for (x in products) {
		newNum = products[x].Data;
		newVal = products[x].Rank;
		if (
			parseInt(newVal) == 1 ||
			parseInt(newVal) == 2 ||
			parseInt(newVal) == 3 ||
			parseInt(newVal) == 11 
		) {
			  exec.setRewardNumber(parseInt(num), parseInt(newNum));
			num += 1;
			console.log(num);
		}
	}

	res.send('finfist');
});
app.get('/products/post1/:Date1', async (req, res) => {
	const { Date1 } = req.params;
	try {
		const products = await Product.find({ Date: Date1,Rank:"1"});
		await exec.setRewardNumber(0,parseInt(products[0].Data))
		res.json(products);
	} catch (error) {
		res.status(400).json(error);
	}
});
app.get('/products/post2/:Date1', async (req, res) => {
	const { Date1 } = req.params;
	try {
		const products = await Product.find({ Date: Date1,Rank:"2"});
		await exec.setRewardNumber(1,parseInt(products[0].Data))
		res.json(products);
	} catch (error) {
		res.status(400).json(error);
	}
});
app.get('/products/post3/:Date1', async (req, res) => {
	const { Date1 } = req.params;
	try {
		const products = await Product.find({ Date: Date1,Rank:"3"});
		await exec.setRewardNumber(2,parseInt(products[0].Data))
		res.json(products);
	} catch (error) {
		res.status(400).json(error);
	}
});
app.get('/products/post4/:Date1', async (req, res) => {
	const { Date1 } = req.params;
	try {
		const products = await Product.find({ Date: Date1,Rank:"4"});
		await exec.setRewardNumber(3,parseInt(products[0].Data))
		res.json(products);
	} catch (error) {
		res.status(400).json(error);
	}
});
app.get('/products/post5/:Date1', async (req, res) => {
	const { Date1 } = req.params;
	try {
		const products = await Product.find({ Date: Date1,Rank:"5"});
		await exec.setRewardNumber(4,parseInt(products[0].Data))
		res.json(products);
	} catch (error) {
		res.status(400).json(error);
	}
});
app.post('/products', async (req, res) => {
	const payload = req.body;
	try {
		const product = new Product(payload);
		await product.save();
		res.status(201).end();
	} catch (error) {
		res.status(400).json(error);
	}
});
app.put('/products/:id', async (req, res) => {
	const payload = req.body;
	const { id } = req.params;

	try {
		const product = await Product.findByIdAndUpdate(id, { $set: payload });
		res.json(product);
	} catch (error) {
		res.status(400).json(error);
	}
});
app.delete('/products/:id', async (req, res) => {
	const { id } = req.params;

	try {
		await Product.findByIdAndDelete(id);
		res.status(204).end();
	} catch (error) {
		res.status(400).json(error);
	}
});
app.listen(PORT, () => {
	console.log(`Application is running on port ${PORT}`);
});
