// // Animation when scrolling
// const observer = new IntersectionObserver(
//     (entries) => {
//         entries.forEach(entry => {
//             entry.target.classList.toggle('fadeinShow', entry.isIntersecting)
//             entry.target.classList.toggle('flyInLeftShow', entry.isIntersecting)
//             if(entry.isIntersecting) observer.unobserve(entry.target)
//         })
        
//     },
//     {
//         rootMargin: "0px 0px -5% 0px",
//         // threshold: 0.25,
//     }
// )

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const columns = Array.from(document.querySelectorAll('.recipe'));
                const index = columns.indexOf(entry.target);
                const columnNumber = (index % 3) + 1;
                entry.target.style.transitionDelay = `${(columnNumber - 1) * 0.1}s`;
                entry.target.classList.add('fadeinShow');
                entry.target.classList.add('flyInLeftShow', entry.isIntersecting)
                observer.unobserve(entry.target);
            }
        });
    },
    {
        rootMargin: "0px 0px -5% 0px",
    }
);


const fadeinHiddenEle = document.querySelectorAll('.fadeinHidden')
fadeinHiddenEle.forEach((el) => observer.observe(el));
const flyInLeftHiddenEle = document.querySelectorAll('.flyInLeftHidden')
flyInLeftHiddenEle.forEach((el) => observer.observe(el));
