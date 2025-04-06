gsap.registerPlugin(ScrollTrigger);

function gsapAnimations(){
    
gsap.from("nav h1",{
    opacity:0,
    duration:1,
    y:100
})
gsap.from(".nav-items ul li",{
    opacity:0,
    duration:1,
    y:100,
    stagger:0.1,
    delay:1
})
gsap.from(".nav-items div button",{
    opacity:0,
    duration:1,
    x:-100,
    delay:1
})
gsap.from(".content-text",{
    opacity:0,
    duration:1,
    y:100,
    delay:1,
    scale:0,
})
gsap.from("#features .feature-title",{
    opacity:0,
    duration:1,
    y:100,
    scrollTrigger:{
        trigger:"#features",
        scroller:"body",
        // markers:true,
        start:"top 60%"
    }
})

gsap.from("#features .feature-content img",{
    opacity:0,
    duration:1,
    x:-200,
    scrollTrigger:{
        trigger:"#features",
        scroller:"body",
        // markers:true,
        start:"top 30%"
    }
})
gsap.from("#features .feature-content .feature-part2",{
    opacity:0,
    duration:1,
    x:200,
    scrollTrigger:{
        trigger:"#features",
        scroller:"body",
        // markers:true,
        start:"top 30%"
    }
})
gsap.from("#disease .feature-content img",{
    opacity:0,
    duration:1,
    x:-200,
    scrollTrigger:{
        trigger:"#disease",
        scroller:"body",
        // markers:true,
        start:"top 70%"
    }
})
gsap.from("#disease .feature-content .feature-part2",{
    opacity:0,
    duration:1,
    x:200,
    scrollTrigger:{
        trigger:"#disease",
        scroller:"body",
        // markers:true,
        start:"top 70%"
    }
})
gsap.from("#insights .feature-content img",{
    opacity:0,
    duration:1,
    x:-200,
    scrollTrigger:{
        trigger:"#insights",
        scroller:"body",
        // markers:true,
        start:"top 70%"
    }
})
gsap.from("#insights .feature-content .feature-part2",{
    opacity:0,
    duration:1,
    x:200,
    scrollTrigger:{
        trigger:"#insights",
        scroller:"body",
        // markers:true,
        start:"top 70%"
    }
})
gsap.from("#insightss .feature-content img",{
    opacity:0,
    duration:1,
    x:-200,
    scrollTrigger:{
        trigger:"#insightss",
        scroller:"body",
        // markers:true,
        start:"top 70%"
    }
})
gsap.from("#insightss .feature-content .feature-part2",{
    opacity:0,
    duration:1,
    x:200,
    scrollTrigger:{
        trigger:"#insightss",
        scroller:"body",
        // markers:true,
        start:"top 70%"
    }
})
}

gsapAnimations()

let cursor = document.querySelector("#cursor")
let body = document.querySelector("body")

body.addEventListener("mousemove",function(dets){
    gsap.to("#cursor",{
        x:dets.x,
        y:dets.y,
        duration:0.8
    })
    
})
 
body.addEventListener("mouseenter",function(dets){
    gsap.to("#cursor",{
        scale:1
    })
    
})
body.addEventListener("mouseleave",function(dets){
    gsap.to("#cursor",{
        scale:0
    })
    
})
 

const lenis = new Lenis({
    duration: 3.2,
})


function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

// Redirect to the subscription page when the message is clicked
function goToSubscriptionPage() {
    window.location.href = "subscription.html";
}


requestAnimationFrame(raf)