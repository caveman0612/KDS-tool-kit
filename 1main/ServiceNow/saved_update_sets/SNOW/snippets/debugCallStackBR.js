try {


    throw new Packages.java.lang.Throwable();


} catch (e) {


    gs.log(e);


    gs.log(Packages.com.glide.util.Log.getStackTrace(e));


}


    // https://www.servicenow.com/community/developer-forum/get-the-call-stack-in-a-business-rule/m-p/1955752




    try {


        throw new Packages.java.lang.Throwable();
     
     
     } catch (e) {
     
     
        var st = e.getStackTrace();
     
     
        var out = [];
     
     
        for (var i = 0; i < st.length; i++)
     
     
        out.push(st[i].toString());
     
     
        gs.log(out.join("\n"));
     
     
     }