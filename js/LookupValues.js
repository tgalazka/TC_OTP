var BTR = BTR || {};
BTR.LookupValues = {};

  BTR.LookupValues.Life_Cycles = {
  values:[
  {key:1,value:'Draft'},
  {key:2,value:'Approval'},
  {key:3,value:'Review'},
  {key:4,value:'Acceptance'},
  {key:5,value:'Posted'}
  ]};
  
  BTR.LookupValues.Budget_Types = {
  values:[
  {key:1,value:'Permanent'},
  {key:2,value:'Temporary'}
  ]};
  
  BTR.LookupValues.Internal_State = {
  values:[
  {key:1,value:'Draft'},
  {key:2,value:'Submitter Approval'},
  {key:3,value:'Leveled Approval'},
  {key:4,value:'Recipient Acceptance'}
  ]};
  
  BTR.LookupValues.Position_Types = {
  values:[
  {key:1,value:'From'},
  {key:2,value:'To'}
  ]};

  BTR.LookupValues.Transfer_Types = {
  values:[
  {key:1,value:'IntraDepartmental'},
  {key:2,value:'InterDepartmental'}
  ]};


  BTR.LookupValues.GetKey = function(arrayObject,lookupValue) {
    if (lookupValue == null) return null;
    
    lookupValue = lookupValue.toLowerCase();
   
   
   for(var index=0; index < arrayObject.length;index++)
    {
      if (arrayObject[index].value.toLowerCase()==lookupValue)
      {
        return arrayObject[index].key;
      }
    }
    return null;
  };

//console.log(BTR.LookupValues.GetKey(BTR.LookupValues.Transfer_Types.values,'Approval'));

