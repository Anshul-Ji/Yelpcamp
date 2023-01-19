const User = require('../models/user');
const expo = module.exports;


expo.renderRegister = (req, res) => {
    res.render("users/register");
}

expo.register = async (req, res, next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, e => {
            if(e) return next(e);
            req.flash('success', "Registered Successfully");
            res.redirect('/campgrounds');
        });
    } catch(e){
        req.flash("error", e.message);
        res.redirect('/users/register');
    }
}

expo.renderLogin = (req, res) => {
    res.render("users/login");
}

expo.login = (req, res) => {
    // console.log('\n\n..............LOGGED IN............\n\n')
    // console.log(req.session.id, req.session);
    // console.log('\n\n\n', `Redirect returnTo: ${req.session.returnTo}\n\n\n`,`\n\n\nRedirect final: ${redirectUrl}`,'\n\n\n\n\n\n\n');
    
    const redirectUrl = req.session.returnTo || '/campgrounds';
    // console.log(redirectUrl);

    delete req.session.returnTo;
    req.flash('success', "Welcome Back!!");
    res.redirect(redirectUrl);
}

expo.logout = (req, res, next) => {
    req.logout();
    req.flash('success', "Successfully logged out!");
    res.redirect('/campgrounds');
}