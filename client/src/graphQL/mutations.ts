import { gql } from "@apollo/client";

// LOGIN USER
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

// REGISTER USER
export const REGISTER_USER = gql`
  mutation register($firstname: String! $lastname: String! $email: String!, $password: String!) {
    register(firstname: $firstname lastname: $lastname email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

//DELETE USER
export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId) {
      _id
      firstname
      lastname
      email
    }
  }
`;

//RESET PASSWORD MUTATION
export const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!, $newPassword: String!) {
    resetPassword(email: $email, newPassword: $newPassword)
  }
`;

export const SET_USER_ROLE = gql`
  mutation SetUserRole($userId: ID!, $role: String!) {
    setUserRole(userId: $userId, role: $role) {
      _id
      firstname
      lastname
      email
      role
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $userData: UserUpdateInput!) {
    updateUser(userId: $userId, userData: $userData) {
      _id
      firstname
      lastname
      email
      role
      createdAt
    }
  }
`;

//Garden Planner mutations
export const SAVE_GARDEN_MUTATION = gql`
  mutation SaveGarden($name: String!, $rows: Int!, $cols: Int!, $plants: [PlantInput!]!) {
    saveGarden(name: $name, rows: $rows, cols: $cols, plants: $plants) {
      id
      name
      rows
      cols
    }
  }
`;

export const DELETE_GARDEN_MUTATION = gql`
  mutation DeleteGarden($id: ID!) {
    deleteGarden(id: $id) {
      id
    }
  }
`;

export const ADD_PLANT_MUTATION = gql`
  mutation AddPlant(
    $plantName: String!
    $plantType: String!
    $plantVariety: String
    $plantWatering: String
    $plantLight: String
    $plantSoil: String
    $plantFertilizer: String
    $plantHumidity: String
    $plantTemperature: String
    $plantToxicity: String
    $plantPests: String
    $plantDiseases: String
    $spacing: Int!
    $growthType: String!
    $isVerticalGrower: Boolean   
    $plantsPerSquareFoot: Float
  ) {
   addPlant(
      plantName: $plantName
      plantType: $plantType
      plantVariety: $plantVariety
      plantWatering: $plantWatering
      plantLight: $plantLight
      plantSoil: $plantSoil
      plantFertilizer: $plantFertilizer
      plantHumidity: $plantHumidity
      plantTemperature: $plantTemperature
      plantToxicity: $plantToxicity
      plantPests: $plantPests
      plantDiseases: $plantDiseases
      spacing: $spacing
      growthType: $growthType
      isVerticalGrower: $isVerticalGrower
      plantsPerSquareFoot: $plantsPerSquareFoot
    ) {
      _id
      plantName
      plantType
      plantVariety
      spacing
      growthType
      isVerticalGrower
      plantsPerSquareFoot     
    }
  }
`;