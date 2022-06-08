import { gql } from '@apollo/client';

/*
 * Uuden kirjan lisäävä query
 */
export const ADD_BOOK = gql`
    mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!){
        addBook (
            title: $title, 
            published: $published, 
            author: $author, 
            genres: $genres
        ){
            title
            published
            author {
                name,
                bookCount
            }
            genres            
        }
    }
`

/*
 * Kirjailijan tietojen editointi
 */ 
export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!) {
        editAuthor(
            name: $name, 
            setBornTo: $setBornTo
        ) {
          name
          born
        }
    }
`

/*
 * Kirjailijoista yhteenvetotiedot hakeva query
 */
export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`;

/*
 * Kirjojen perustietojen haku
 */
export const ALL_BOOKS = gql`
    query {
        allBooks {
            title
            published
            author {
                name
            }
            genres
        }
        distinctGenres
    }
`;

/*
 * ... Tilaukset clientissä
 */
export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            title
            published
            author {
                name
            }
            genres
        }
    }
`;

/*
 *
 */
export const GENRE_FILTERED_BOOKS = gql`
    query Query($genre: String) {
        allBooks(genre: $genre){
            title
            published
            author {
                name
            }
            genres
        }
        distinctGenres
    }
`;

export const LOGIN = gql`
    mutation login($username: String!, $password: String!){
        login(username: $username, password: $password) {
            value
        }
    }
`

export const MY_RECOMMENDATIONS = gql`
    query {
        myRecommendations {
            title
            published
            genres
            author {
                name
            }
        }
        me {
            username
            favoriteGenre
        }
    }
`