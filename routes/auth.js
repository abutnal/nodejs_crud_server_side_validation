var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var db = require('./database');


// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
router.use(bodyParser.json())

// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require('express-validator');

// Public directory access
router.use(express.static(__dirname + '../public'));




// GET home page_______________________________________________________________________________________
router.get('/', function(req, res, next) {
  res.render('login', { 
  	title: 'Login page',
    form_title: 'Enter username and password'
  });
});





// Display All users records_____________________________________________________________________________ 
const SELECT_ALL_QUERY = "SELECT * FROM user_tbl";
function showData(){
  router.post('/', (req, res)=>{ 
   db.query(SELECT_ALL_QUERY, function(err, result){
     if(err){
      return res.send(err);
    }
    else{
     const customers = result;
     return res.json(customers);
   }
 });

 });
}

showData();






// User Create/Update_____________________________________________________________________________ 
router.post('/create_or_update_User', [
  check('name', 'Required').not().isEmpty(),
  check('phone', 'Required').not().isEmpty(),
  check('email', 'Email is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Invalid Email id').isEmail(),
  check('password', 'Invalid password').isLength({min:5}),
  check('phone', 'Invalid phone').isLength({min:10, max:10})
  ], (req,res)=>{
   const errors = validationResult(req);
   if(!errors.isEmpty()){
    return res.json(errors);
  }
  else{
   var SQL_QUERY = '';
   var message = '';
   if(req.body.user_id!=''){
    SQL_QUERY = "UPDATE user_tbl SET `name`='"+req.body.name+"', `phone`='"+req.body.phone+"', `email`='"+req.body.email+"', `password`='"+req.body.password+"' WHERE `user_id`='"+req.body.user_id+"'";
    message = 'updated';
  }
  else{
    SQL_QUERY = "INSERT INTO user_tbl (name, phone, email, password) VALUES ('"+req.body.name+"', '"+req.body.phone+"', '"+req.body.email+"', '"+req.body.password+"')";
    message = 'added';
  }    
  db.query(SQL_QUERY, function (err, result) {
    if (err) throw err;
    return res.json({
      status: 'success', msg:message
    });

  }); 
}
});




// User Action Edit/Delete Record____________________________________________________________________
router.post('/user_action',(req,res)=>{
 const user_id = req.body.user_id;
 const btn_type = req.body.btn_type;
 var SELECT_WHERE = '';
 var returnData = '';

 if(btn_type=='edit'){
   SELECT_WHERE = "SELECT * FROM user_tbl WHERE user_id='"+ req.body.user_id +"'";
   returnData = 'edit';
 }
 else if(btn_type=='delete'){
  SELECT_WHERE = "DELETE FROM user_tbl WHERE user_id='"+ req.body.user_id +"'";
  returnData = 'deleted';
}

db.query(SELECT_WHERE, function(err, result){
 if(err) throw err;

 if(returnData == 'edit'){
   return res.json({result});
 }
 else if(returnData=='deleted'){
  return res.json({ status:returnData});
}

});
});



module.exports = router;
