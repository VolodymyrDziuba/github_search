import { gql } from "@apollo/client"
import { RepoModel } from "../../models/RepoModel"
import { GET_FAVORITE_REPOS_LIST } from "../../graphql/query"
import { toast } from "react-toastify"

const query = GET_FAVORITE_REPOS_LIST

export default {
  Mutation: {
    addRepoToFavorites: (_, { repo }: { repo: RepoModel }, { cache }) => {
      const previousState = cache.readQuery({ query })
      const newFavRepo = {
        __typename: "FavRepoItem",
        id: repo.id,
        name: repo.name,
        description: repo.description,
        rating: 0,
      }
      const data = {
        favoriteRepos: previousState.favoriteRepos.concat([newFavRepo]),
      }

      cache.writeQuery({ query, data })

      toast.success("Repo added to favorites")
      return newFavRepo
    },
    removeRepoFromFavorites: (_, { id }, { cache }) => {
      const currentFavRepos = cache.readQuery({
        query,
      })
      const removedFavoriteReposArr = currentFavRepos.favoriteRepos.filter(
        (repo: RepoModel) => {
          return repo.id !== id
        },
      )
      const data = {
        favoriteRepos: removedFavoriteReposArr,
      }

      cache.writeQuery({ query, data })

      toast.success("Repo removed from favorites")
      return null
    },
    rateFavoriteRepo: (_, variables, { cache }) => {
      const id = `FavRepoItem:${variables.id}`
      const fragment = gql`
        fragment RateFavRepo on FavRepoItem {
          rating
        }
      `
      const favRepo = cache.readFragment({ fragment, id })
      const data = { ...favRepo, rating: variables.rating }

      cache.writeFragment({ fragment, id, data })
      return null
    },
  },
}
