const { blogs } = require("../tests/testMaterial");

const dummy = (blogs) => {
    return 1;
}

/*
 * 4.5*: apufunktioita ja yksikkötestejä, step3
 * Määrittele funktio favoriteBlog, joka saa parametrikseen taulukollisen blogeja. 
 * Funktio selvittää millä blogilla on eniten tykkäyksiä. Jos suosikkeja on monta, 
 * riittää että funktio palauttaa niistä jonkun.
 */
const favoriteBlog = (blogs) => {

    let numbOfLikes = -1;
    let mostPopularBlog = undefined;

    blogs.forEach(blog => {
        
        if(blog.likes > numbOfLikes){
            numbOfLikes = blog.likes;
            mostPopularBlog = blog;
        }
    });

    return mostPopularBlog;

}

/*
 * 4.6*: apufunktioita ja yksikkötestejä, step4
 *
 * Määrittele funktio mostBlogs, joka saa parametrikseen taulukollisen blogeja. 
 * Funktio selvittää kirjoittajan, jolla on eniten blogeja. 
 * Funktion paluuarvo kertoo myös ennätysbloggaajan blogien määrän.
 */
const mostBlogs = (blogs) => {

    let authorBlogs = {};

    let numbOfMost = -1;
    let authorWithMostBlogs = undefined

    blogs.forEach(blog => {

        let author = blog.author;

        if(author in authorBlogs){

            let newNumbOfBlogs = authorBlogs[author] + 1;

            authorBlogs[author] = newNumbOfBlogs;

            if(newNumbOfBlogs > numbOfMost) {
                numbOfMost = newNumbOfBlogs;

                authorWithMostBlogs = {
                    author: author,
                    blogs: numbOfMost
                }
            }
        }
        else {

            if(numbOfMost === -1){
                numbOfMost = 1;

                authorWithMostBlogs = {
                    author: author,
                    blogs: numbOfMost
                }

            }

            authorBlogs[author] = 1
        }
    
    });

    return authorWithMostBlogs

}

/*
 * 4.7*: apufunktioita ja yksikkötestejä, step5
 * Funktio selvittää kirjoittajan, jonka blogeilla on eniten tykkäyksiä.
 * (Jos suosikkibloggaajia on monta, riittää että funktio palauttaa niistä jonkun.)
 */
const mostLikes = (blogs) => {

    let authorBlogs = {};

    let numbOfMostLikes = -1;
    let authorWithMostLikes = undefined

    blogs.forEach(blog => {

        let author = blog.author;
        let likes = blog.likes;

        if(author in authorBlogs){
            let newNumbOfLikes = authorBlogs[author] + likes;
            authorBlogs[author] = newNumbOfLikes;   
            
            if(newNumbOfLikes > numbOfMostLikes){
                numbOfMostLikes = newNumbOfLikes;

                authorWithMostLikes = {
                    author: author,
                    likes: newNumbOfLikes
                }

            }

        } else {
            authorBlogs[author] = likes

            if(likes > numbOfMostLikes) {

                numbOfMostLikes = likes;

                authorWithMostLikes = {
                    author: author,
                    likes: likes
                }
            }
        }
    })

    return authorWithMostLikes
}

/*
 * 4.4: apufunktioita ja yksikkötestejä, step2
 * Määrittele funktio totalLikes, joka saa parametrikseen taulukollisen blogeja.
 * Funktio palauttaa blogien yhteenlaskettujen tykkäysten eli likejen määrän.
 */
const totalLikes = (blogs) => {

    const reducer = (sum, item) => {
        return sum + item
    }

    if(blogs.lenght === 0)
        return 0;

    const likeCountArr = blogs.map(blog => blog.likes);

    return likeCountArr.reduce(reducer, 0);

}

module.exports = {
    dummy,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    totalLikes
}