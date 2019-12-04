

// User Create/Update_____________________________________________________________________________
$(document).ready(function(){
  $(document).on('submit', '#saveForm', function(e){
   e.preventDefault();
   $form = $(this)
   var postData = $form.serialize();
   $.ajax({
    url: $form.attr('action'),
    method: 'POST',
    data: postData,
    type: 'JSON',
            // contentType: false,
            // processData: false,
            // cache: false,
            success:function(response){

              if(response.status=='success'){
                $alert_msg = '';                
                $alert_msg +='<div class="alert alert-success alert-dismissible fade show" role="alert">';
                $alert_msg +='User '+response.msg+' successfully.';
                $alert_msg +='<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
                $alert_msg +='<span aria-hidden="true">&times;</span>';
                $alert_msg +='</button>';
                $alert_msg +='</div>';
                $('#status_msg').html($alert_msg);
                $('#saveForm')[0].reset();
                $('.btn-register').html('Register');
                $('#user_id').val('');
                show();
              // console.log('Validation success');
            }
            else{
                // console.log('Validation Failed');
                $.each(response.errors, function(key, field){

                 if(field.param=='email' && field.value!=''){
                   $('#label-'+field.param).html('Invalid email id');
                   $('#label-'+field.param).removeClass('remove_err_class');
                   $('#label-'+field.param).addClass('add_err_class');
                 }

                 if(field.param=='email' && field.value==''){
                   $('#label-'+field.param).html('Email is required');
                   $('#label-'+field.param).removeClass('remove_err_class');
                   $('#label-'+field.param).addClass('add_err_class');
                 }


                 if(field.param=='password' && field.value!=''){
                   $('#label-'+field.param).html('Password should be minimum 5 characters');
                   $('#label-'+field.param).removeClass('remove_err_class');
                   $('#label-'+field.param).addClass('add_err_class');
                 }

                 if(field.param=='password' && field.value==''){
                   $('#label-'+field.param).html('Password is required');
                   $('#label-'+field.param).removeClass('remove_err_class');
                   $('#label-'+field.param).addClass('add_err_class');
                 }


                 if(field.param=='phone' && field.value!=''){
                   $('#label-'+field.param).html('Phone number should be 10 digits');
                   $('#label-'+field.param).removeClass('remove_err_class');
                   $('#label-'+field.param).addClass('add_err_class');
                 }

                 if(field.param=='phone' && field.value==''){
                   $('#label-'+field.param).html('Phone number is required');
                   $('#label-'+field.param).removeClass('remove_err_class');
                   $('#label-'+field.param).addClass('add_err_class');
                 }

                 if(field.msg=='Required'){
                  var  fieldName = field.param.charAt(0).toUpperCase() + field.param.slice(1)
                  $('#label-'+field.param).html(fieldName +' is required');
                  $('#label-'+field.param).removeClass('remove_err_class');
                  $('#label-'+field.param).addClass('add_err_class');
                }

              });
              }


            }


          });
 })
});



//Remove validation css class_____________________________________________________________________________
$(document).on('keydown', 'input', function(){
  $form = $(this);
  var x = $form.serializeArray();
  $.each(x, function(i, field){
    var  fieldName = field.name.charAt(0).toUpperCase() + field.name.slice(1)
    $('#label-'+field.name).html(fieldName);
    $('#label-'+field.name).removeClass('add_err_class');
    $('#label-'+field.name).addClass('remove_err_class');
  });
});




// Display All users records_____________________________________________________________________________
$(document).ready(function(){
  show();
});

function show(){
  $.ajax({
   url: 'http://localhost:3000',
   method: 'post',
   data: {showData:1},
   success: function(responseData){
     $html = '';
     $html +='<table class="table table-bordered">';
     $html +='<thead>';
     $html +='<th>SL</th>';
     $html +='<th>Name</th>';
     $html +='<th>Phone</th>';
     $html +='<th>Email</th>';
     $html +='<th>Password</th>';
     $html +='<th>Action</th>';
     $html +='</thead> ';
     var count = 1;   
     $.each(responseData, function(key, value){


      $html +='<tr>';
      $html +='<td>'+ count++ +'</td>';
      $html +='<td>'+value.name+'</td>';
      $html +='<td>'+value.phone+'</td>';
      $html +='<td>'+value.email+'</td>';
      $html +='<td>'+value.password+'</td>';
      $html +='<td style="text-align:right"><a href="" id="edit_user" btn-type="edit" data-id="'+value.user_id+'" class="btn btn-primary btn-sm user_action">Edit</a> &nbsp; \
      <a href="" class="btn btn-danger btn-sm user_action" btn-type="delete"  data-id="'+value.user_id+'">Delete</a></td>';
      $html +='</tr>';
    });

     $html +='</table>'; 

     $('#dataTable').html($html);    
   }
 });
}



// User Action Edit/Delete Record____________________________________________________________________
$(document).ready(function(){
 $(document).on('click', '.user_action', function(e){
  event.preventDefault();
  $anchor = $(event.target);
  var id = $anchor.attr('data-id');
  var btn_type = $anchor.attr('btn-type');

  if(btn_type=='delete'){
    if (!confirm("Do you want to delete ?")){
      return false;
    }
  }
  $.ajax({
    url: 'http://localhost:3000/user_action',
    method: 'post',
    dataType: 'json',
    data:{user_id:id, btn_type:btn_type},
    success:function(response){

      if(response.result){
                            // console.log(response[0].name);
                            $('#user_id').val(response.result[0].user_id);
                            $('#name').val(response.result[0].name);
                            $('#phone').val(response.result[0].phone);
                            $('#email').val(response.result[0].email);
                            $('#password').val(response.result[0].password);
                               // $("form#saveForm").prop('id','updateForm');
                               // $("form#saveForm").prop('action','http://localhost:3000/updateUser');
                               $('.btn-register').html('Update');
                        // show();
                      }
                      else if(response.status=='deleted'){
                       $alert_msg = '';                
                       $alert_msg +='<div class="alert alert-danger alert-dismissible fade show" role="alert">';
                       $alert_msg +='User '+response.status+' successfully.';
                       $alert_msg +='<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
                       $alert_msg +='<span aria-hidden="true">&times;</span>';
                       $alert_msg +='</button>';
                       $alert_msg +='</div>';
                       $('#status_msg').html($alert_msg);
                       $('#saveForm')[0].reset();
                       $('.btn-register').html('Register');
                       $('#user_id').val('');
                       show();
                     }

                   }
                 });
})
});



