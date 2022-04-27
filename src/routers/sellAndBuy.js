const express = require('express')
const SellBuy = require('../mongoose/models/sellBuy')

const sellAndBuyRouter = new express.Router()

sellAndBuyRouter.get('/sellProduct', async(req, res) => {
    const match = {}
    const sort = {}
    if (req.query.sortBy) {
        const sortBy = req.query.sortBy
        if (sortBy === 'lowerCostPrice') {
            sort.costPrice = 1
        } else if (sortBy === 'higherCostPrice') {
            sort.costPrice = -1
        } else if (sortBy === 'lowerSoldPrice') {
            sort.soldPrice = 1
        } else if (sortBy === 'higherSoldPrice') {
            sort.soldPrice = -1
        }
    }

    if (req.query.product) {
        match.productName = req.query.product
    }

    const products = await SellBuy.find( match ).sort(sort)
    
    if (!products) {
        return res.status(400).send()
    }

    res.status(200).send(products)
})

sellAndBuyRouter.post('/sellProduct', async(req, res) => {
    const product = new SellBuy(req.body)

    if (product.productName.length < 4) {
        return res.status(400).send({ error : 'product name should have minimum of four characters' })
        
    }
    if (product.costPrice < 1) {
        return res.status(400).send({ error : 'cost price value cannot be zero or negative value' })
    }
    try {
        await product.save()
        res.status(201).send({message: 'Product Added'})
    } catch (error) {
        res.status(400).send()
    }
})

sellAndBuyRouter.patch('/sellProduct/:id', async(req, res) => {
    const product = await SellBuy.findById(req.params.id)

    if (req.body.soldPrice < 1) {
        return res.status(400).send({ error : 'sold price value cannot be zero or negative value' })
    }

    try {
        await product.save()
        res.status(200).send({message: 'Updated Successfully'})
    } catch (error) {
        res.status(400).send()
    }
})

sellAndBuyRouter.delete('/sellProduct/:id', async(req, res) => {
    
    try {
        await SellBuy.findOneAndDelete({ _id: req.params.id })
        res.status(200).send({ message: 'Deleted successfully'})
    } catch (error) {
        res.status(400).send()
    }
})

module.exports = sellAndBuyRouter