const key = '2d64e13ee8c539c8e30cf813430bc482';
const base = 'https://www.flickr.com/services/rest/?';
const method_interest = 'flickr.interestingness.getList';
const per_page = 10;
const url = `${base}method=${method_interest}&api_key=${key}&perpage=${per_page}&format=json&nojsoncallback=1`;
const main = document.querySelector('section');

//리스트 초기화
initList(url);
imgLoaded();

//데이터 호출 및 DOM생성 동기처리 함수
async function initList(url){
    const data = await getFlickr(url);
    createList(data);
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


    function imgLoaded(){
         //일단 모든 이미지를 다 불러온 후 액박이 뜨는 이미지만 대체이미지로 처리완료 
        const imgs = document.querySelectorAll('img');
        imgs.forEach(img =>{
            img.onerror=()=>{
                img.setAttribute('src','k1.jpg');
            }
        });

        //정렬모션 처리
        new Isotope(main,{
            itemSelector : 'article',
            columnWidth : 'article',
            transitionDuration : '0.5s'
        })
    }
}

    