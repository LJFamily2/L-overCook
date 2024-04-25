const checkAdmin = async(req, res, next) => {
    if(req.user.role === true){
        next();
    }else{
        req.flash('error', 'You do not have permission to access this page');
        return res.redirect('/signin');
    }
}

module.exports = checkAdmin;