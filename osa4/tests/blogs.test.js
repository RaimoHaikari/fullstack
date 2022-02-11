const listHelper = require('../utils/listHelper');
const testSet = require('./testMaterial');

/*
 * 4.4: apufunktioita ja yksikkötestejä, step2
 * Määrittele funktio totalLikes, joka saa parametrikseen taulukollisen blogeja. 
 * Funktio palauttaa blogien yhteenlaskettujen tykkäysten eli likejen määrän.
 */
describe('total likes', () => {

    const listWithOneBlog = testSet.blogs.filter(blog => blog._id==='5a422a851b54a676234d17f7');

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(7)
    })

    test('when list has several blogs, result is sum of likes those have', () => {
        const result = listHelper.totalLikes(testSet.blogs)
        expect(result).toBe(36)        
    })

    test('empty list has 0 likes', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)        
    })
});

/*
 * 4.5*: apufunktioita ja yksikkötestejä, step3
 * Määrittele funktio favoriteBlog, joka saa parametrikseen taulukollisen blogeja. 
 * Funktio selvittää millä blogilla on eniten tykkäyksiä. Jos suosikkeja on monta, 
 * riittää että funktio palauttaa niistä jonkun.
 * 
 */
describe('favourite blog', () => {

    const mostPopularBlog = testSet.blogs.filter(blog => blog._id==='5a422b3a1b54a676234d17f9')[0];

    test('when list has several blogs, function finds the blog that has most likes', () => {
        const result = listHelper.favoriteBlog(testSet.blogs);
        expect(mostPopularBlog.likes).toBe(result.likes);
    });

    test('when there is only one blog, that blog is returned', () => {
        const result = listHelper.favoriteBlog([mostPopularBlog]);
        expect(mostPopularBlog.likes).toBe(result.likes);
    });

    test('empty list returns undefined', () => {
        const result = listHelper.favoriteBlog([]);
        expect(typeof result).toBe('undefined');
    });
    
});

/*
 * 4.6*: apufunktioita ja yksikkötestejä, step4
 *
 * Funktio selvittää kirjoittajan, jolla on eniten blogeja. 
 * Funktion paluuarvo kertoo myös ennätysbloggaajan blogien määrän.
 * 
 * { author: 'Robert C. Martin', blogs: 3 }
 * { author: 'Edsger W. Dijkstra', blogs: 1 }
 */
describe('authors: most blogs', () => {

    const justOneBlog = testSet.blogs.filter(blog => blog._id==='5a422b3a1b54a676234d17f9');

    const authorWithMostBlogs = {author: 'Robert C. Martin', blogs: 3};
    const whenThereIsOnlyOne =  {author: 'Edsger W. Dijkstra', blogs: 1};

    test('when list has several blogs, function finds who has most blogs', () => {
        const result = listHelper.mostBlogs(testSet.blogs);
        expect(authorWithMostBlogs).toEqual(result);
    });

    test('empty list returns undefined', () => {
        const result = listHelper.mostBlogs([]);
        expect(typeof result).toBe('undefined');
    });

    
    test('when there is only one blog, info of that author is returned', () => {
        const result = listHelper.mostBlogs(justOneBlog);
        expect(whenThereIsOnlyOne).toEqual(result);
    });
    

});


/*
 * 4.7*: apufunktioita ja yksikkötestejä, step5
 *
 * Funktio selvittää kirjoittajan, jonka blogeilla on eniten tykkäyksiä. 
 * Funktion paluuarvo kertoo myös suosikkibloggaajan likejen yhteenlasketun määrän:
 * 
 * { author: 'Edsger W. Dijkstra', likes: 17 }
 * { author: 'Edsger W. Dijkstra', likes: 12 }
 */
describe('authors: most likes', () => {

    const justOneBlog = testSet.blogs.filter(blog => blog._id==='5a422b3a1b54a676234d17f9');

    const authorWithMostLikes = {author: 'Edsger W. Dijkstra', likes: 17 };
    const whenThereIsOnlyOne =  {author: 'Edsger W. Dijkstra',likes: 12 };

    test('when list has several blogs, function finds who has most likes', () => {
        const result = listHelper.mostLikes(testSet.blogs);
        expect(authorWithMostLikes).toEqual(result);
    });

    test('empty list returns undefined', () => {
        const result = listHelper.mostLikes([]);
        expect(typeof result).toBe('undefined');
    });

    
    test('when there is only one blog, info of that author is returned', () => {
        const result = listHelper.mostLikes(justOneBlog);
        expect(whenThereIsOnlyOne).toEqual(result);
    });
    

})

