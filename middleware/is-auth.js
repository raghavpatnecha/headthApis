//call this to check if user is logged in or not
module.exports=(req,res,next)=>{
    if(!req.session.islogged)
    {
        return res.redirect('/admin/welcome');
    }
    next();
}