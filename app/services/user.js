angular.module("app").factory("User",["$resource","Config",function(e,r){return e(r.apiBase+"user",{},{multi:{method:"GET",isArray:!0},create:{method:"POST"},read:{method:"GET",url:r.apiBase+"user/:id"},update:{method:"PUT",url:r.apiBase+"user/:id"},remove:{method:"DELETE",url:r.apiBase+"user/:id"}})}]);