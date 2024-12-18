function signIn()
{
     let OAuth = 'https://accounts.google.com/o/oauth2/v2/auth'


     let form = document.createElement('form')
     form.setAttribute('method','GET')
     form.setAttribute('action',OAuth)

     let params = {
          'client_id':'206928147239-acsvb283mbiphfff9s1hscmk1dd2c5rj.apps.googleusercontent.com',
          'redirect_uri':'http://127.0.0.1:5500/api/output.html',
          'response_type':'token',
          'scope':'https://www.googleapis.com/auth/userinfo.profile',
          'include_granted_scopes':'true',
          'state':'pass-through-value'
     }

     for(var p in params)
     {
          let input = document.createElement('input')
          input.setAttribute('type','hidden')
          input.setAttribute('name',p)
          input.setAttribute('value',params[p])
          form.appendChild(input);

     }
     document.body.appendChild(form)
     form.submit();

}