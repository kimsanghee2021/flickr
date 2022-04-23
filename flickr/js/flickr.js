const key = '2d64e13ee8c539c8e30cf813430bc482';
const loading = document.querySelector('.loading');
const base = 'https://www.flickr.com/services/rest/?';
const method_interest = 'flickr.interestingness.getList';
const method_search = 'flickr.photos.search';
const input = document.querySelector('input');
const btn = document.querySelector('button');
const per_page = 50;
const url = `${base}method=${method_interest}&api_key=${key}&perpage=${per_page}&format=json&nojsoncallback=1`;

const main = document.querySelector('section');

//리스트 초기화
initList(url);

btn.addEventListener('click',(e)=>{
    e.preventDefault();
    let tag = input.value.trim();

    if(!tag){
        alert('검색창에 입력해주세요.');
        return;
    } 
    main.classList.remove('on');
    loading.classList.remove('off');
    const url2 = `${base}method=${method_search}&api_key=${key}&per_page=${per_page}&format=json&nojsoncallback=1&tags=${tag}`;
    initList(url2);
});


//데이터 호출 및 DOM생성 동기처리 함수
async function initList(url){
    const data = await getFlickr(url);
    createList(data);
    imgLoaded();
}


//flickr 데이터 반환함수
function getFlickr(url){
    return fetch(url)
    .then(data=>{
        return data.json();
    })
    .catch(err=>{
        console.error(err);
    })
    .then(json=>{
        const items = json.photos.photo;     
        return items;     
    })
}

//리스트 생성 함수
function createList(data){
    let htmls = '';

    data.forEach(item=>{
        htmls += `
        <article>
            <div>
                <a class='pic' href='https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_b.jpg'>
                    <img src='https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg' />
                </a>
                <p>${item.title}</p>
                <div class='profile'>
                    <img src='http://farm${item.farm}.staticflickr.com/${item.server}/buddyicons/${item.owner}.jpg' />
                    <span>${item.owner}</span>
                </div>
            </div>
        </article>       
        
        `;
    })
    main.innerHTML = htmls;

}

    function imgLoaded(){
        const imgs = document.querySelectorAll('img');
        //이때 len은 이미 body안쪽에있는 로딩 이미지까지 포함해서 100개
        const len = imgs.length;//1001
        let count = 0;

        imgs.forEach(img =>{
            img.onerror=()=>{
                img.setAttribute('src','k1.jpg');
            }

            //각각의 img dom이 반복돌면서 해당 돔에 소스 이미지까지 로딩 완료 될때 마다 
            img.onload = ()=>{
                //카운트값 증가
                count++;
                console.log(len);

                if(count ==len-1){
                    //정렬모션 처리
                    new Isotope(main,{
                        itemSelector : 'article',
                        columnWidth : 'article',
                        transitionDuration : '0.5s'
                    });
                    main.classList.add('on');
                    loading.classList.add('off');
                }

            }
        });


}

    