export function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname){
    let arr = document.cookie.split('; ');
    let target = arr.find(item=>{
        
        return item.indexOf(cname)!=-1;
    })
    if(target){
        return target.split('=')[1];
    }else{
        return false;
    }
    
}
