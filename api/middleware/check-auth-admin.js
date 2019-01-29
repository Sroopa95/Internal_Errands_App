const jwt =  require('jsonwebtoken');

module.exports =(req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        if(req.userData.admin){
            next();
        }else{
            throw new Error('permission denied, you are not admin')
        }
    }catch(error){
        return res.status(401).json({
            message: 'auth failed'
        });
    }
};