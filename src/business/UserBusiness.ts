import { UserDatabase } from "../database/UserDatabase"
import { User } from "../models/User"
import { UserDB } from "../types"

export class UserBusiness {
  public getUsers = async (q: string | undefined) => {

    const userDatabase = new UserDatabase()
    const usersDB = await userDatabase.findUsers(q)

    const users: User[] = usersDB.map((userDB) => new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.created_at
    ))

    return users
  }

  public createUser = async (input: any) => {

    const {id, name, email, password} = input

    if (typeof id !== "string") {
      // res.status(400)
      throw new Error("'id' deve ser string")
  }

  if (typeof name !== "string") {
      // res.status(400)
      throw new Error("'name' deve ser string")
  }

  if (typeof email !== "string") {
      // res.status(400)
      throw new Error("'email' deve ser string")
  }

  if (typeof password !== "string") {
      // res.status(400)
      throw new Error("'password' deve ser string")
  }

  const userDatabase = new UserDatabase()
  const userDBExists = await userDatabase.findUserById(id)

  if (userDBExists) {
      // res.status(400)
      throw new Error("'id' já existe")
  }

  const newUser = new User(
      id,
      name,
      email,
      password,
      new Date().toISOString()
  ) // yyyy-mm-ddThh:mm:sssZ

  const newUserDB: UserDB = {
      id: newUser.getId(),
      name: newUser.getName(),
      email: newUser.getEmail(),
      password: newUser.getPassword(),
      created_at: newUser.getCreatedAt()
  }

  await userDatabase.insertUser(newUserDB)

  return ({
    message: "Usuário criado com sucesso.",
    user: newUser
  })
  }

  public editUser = async (idToEdit:string, newName: string, newEmail: string, newPassword: string) => {
    if(idToEdit === undefined){
      // res.status(400)
      throw new Error("Informe um id")
    }
    
    const userDatabase = new UserDatabase()
    const userDB = await userDatabase.findUserById(idToEdit)
    
    if (!userDB) {
      // res.status(404)
      throw new Error("'id' não encontrado")
    }
    
    if (typeof newName !== "string" || typeof newEmail !== "string" || typeof newPassword !== "string") {
      // res.status(400)
      throw new Error("Os dados devem ser do tipo string")
    }
    
    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.created_at
      )
      
      const newUserDB = {
        id: user.getId(),
        name: newName || user.getName(),
        email: newEmail || user.getEmail(),
        password: newPassword || user.getPassword(),
        created_at: user.getCreatedAt()
      }
      console.log(idToEdit, newUserDB)

    await userDatabase.updateUser(idToEdit, newUserDB)

    return ({
      message: "User editado com sucesso",
    })
  }
}