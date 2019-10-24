
var ElementosClick=new Array();
document.onclick=captura_click;
function captura_click(e)
{
    var a;
    if(e==null)
    {
        a=event.srcElement
    }
    else
    {
        a=e.target
    }
    ElementosClick.push(a);
    if(a.className=="arrowchat_chatroom_message_name")
    {
        var b=a.parentNode.parentNode.parentNode.id;
        var c=b.substring(25);
        var d="arrowchat_popout_text_cr-"+c;
        var f=a.innerHTML;
        var g="@"+f.slice(0,-1);
        document.getElementById(d).nextSibling.lastChild.firstChild.value=g+" ";
        document.getElementById(d).nextSibling.lastChild.firstChild.focus();
        document.getElementById(d).nextSibling.lastChild.firstChild.click()

    }
}




setInterval("toniarroww()",3000);
function toniarroww()
{
    var a=document.getElementsByClassName("arrowchat_chatboxmessagecontent");
    for(i=0;
        i<a.length;
        i++)
    {
        if(a[i].firstChild.innerHTML===undefined)
        {
        }
        else
        {
            var b=a[i].firstChild.innerHTML;
            posicion=b.indexOf('youtu.be/');
            if(posicion!==-1)
            {
                var c=b.substring(posicion+9);
                numcaracteres=c.length;
                porcion2=c.substring(numcaracteres,0);
                b="https://youtube.com/embed/"+porcion2;
                var d=document.createElement('iframe');
                d.setAttribute("src",b);
                a[i].appendChild(d);
                d.setAttribute('allowFullScreen', '')
                d.style.width="100%";
                d.style.height="360px";
                d.style.border="none";
                a[i].style.fontSize="0px";
                a[i].className="MyClass"
            }
            posicion=b.indexOf('watch?v=');
            if(posicion!==-1)
            {
                var c=b.substring(posicion+8);
                numcaracteres=c.length;
                porcion2=c.substring(numcaracteres,0);
                b="https://youtube.com/embed/"+porcion2+"?allowfullscreen=true";
                var d=document.createElement('iframe');
                d.setAttribute("src",b);
                a[i].appendChild(d);
                d.setAttribute('allowfullscreen','1')
                d.setAttribute('webkitallowfullscreen','1')
                d.style.width="640px";
                d.style.height="360px";
                d.style.border="none";
                a[i].style.fontSize="0px";
                a[i].className="MyClass"
            }
            posicion=b.indexOf('vimeo.com/');
            if(posicion!==-1)
            {
                var c=b.substring(posicion+10);
                numcaracteres=c.length;
                porcion2=c.substring(numcaracteres,0);
                b="https://player.vimeo.com/video/"+porcion2;
                var d=document.createElement('iframe');
                d.setAttribute("src",b);
                d.style.width="640px";
                d.style.height="360px";
                d.style.border="none";
                d.setAttribute('allowFullScreen', '')

                a[i].appendChild(d);
                a[i].style.fontSize="0px";
                a[i].className="MyClass"
            }
            posicion=b.indexOf('facebook.com/');
            if(posicion!==-1)
            {
                var c=b.substring(posicion+13);
                numcaracteres=c.length;
                porcion2=c.substring(numcaracteres,0);
                b="https://www.facebook.com/plugins/video.php?href=https://facebook.com/"+porcion2;
                var d=document.createElement('iframe');
                d.setAttribute("src",b);
                d.style.width="auto";
                d.style.height="360px";

                d.style.border="none";
                d.setAttribute('allowFullScreen', '')
                a[i].appendChild(d);
                a[i].style.fontSize="0px";
                a[i].parentNode.style.backgroundColor="transparent";
                a[i].className="MyClass"
            }
            posicion=b.indexOf('.tumblr.com/post/');
            if(posicion!==-1)
            {
                var c=b.substring(posicion+17);
                numcaracteres=c.length;
                porcion2=c.substring(numcaracteres,0);
                posicionn=b.indexOf('https://');
                porcion3=b.substring(8,posicion);
                enlacefinal="https://www.tumblr.com/video/"+porcion3+"/"+porcion2+"/700/";
                var d=document.createElement('iframe');
                d.setAttribute("src",enlacefinal);
                d.style.width="100%";
                d.style.height="476px";
                d.style.border="none";
                a[i].appendChild(d);
                a[i].style.fontSize="0px";
                a[i].className="MyClass"
            }
        }
    }
}
