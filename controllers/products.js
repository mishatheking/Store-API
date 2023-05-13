const Product = require('../models/product')

const getAllProductStatic = async (req, res) => {
                                                                     //tesing out exprss async errors  // throw Error("There been a fuck up"); 
    const products = await Product.find({price:{$gt:29}})
        .sort('name')    
        // .select('name price')
        // .limit(3)
        // .skip(3);
    
    res.status(200).json({ nbHits: products.length, products })
}

const getAllProduct = async (req, res) => {
                                                                    // to avoid irrelevant query objects, streamline what is passed
    const { name, featured, company, sort, fields, numericFilters } = req.query;
    const queryObject = {};                                         //creating another query object

    if (featured){
        queryObject.featured = featured === "true" ? true : false;
    }
    if (company ){
        // queryObject.company = company; 
        queryObject.company = { $regex: company, $options: 'i' };
    }
    if (name){
        queryObject.name = { $regex: name, $options: 'i' };
    }  
    if (numericFilters) {
        const operatorMap = {
            ">" :"$gt",
            ">=" :"$gte",
            "=" :"$eq",
            "<" :"$lt", 
            "<=" :"$lte", 
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };      //eg product.find(price:{gt:45})
            }
        });
                
    }
    console.log(queryObject)

    // const products = await Product.find(queryObject);            //since sort is applied after products are found we cant use it on await
    let result = Product.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList);
        queryObject.sort = sortList; 
    }
    if (fields) {                                                   //fields selection
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList);
        queryObject.fields = fieldsList; 
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    
    result = result.skip(skip).limit(limit)

    const products = await result

    // console.log(queryObject);
    res.status(200).json({ nbHits: products.length, products })
}
 
module.exports = {
    getAllProduct,
    getAllProductStatic
} 