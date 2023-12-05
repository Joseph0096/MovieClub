import { FirebaseConfig } from "./config/Config"
import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth"
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  writeBatch,
  getDoc
} from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"

import { Header } from "./components/Header"
import './App.css'
import { About } from "./pages/About"
import { Home } from "./pages/Home"
import { Contact } from "./pages/Contact"
import { Signup } from "./pages/Signup"
import { Signout } from "./pages/Signout"
import { Signin } from "./pages/Signin"
import { Detail } from "./pages/Detail"

//contexts
import { AuthContext } from "./contexts/AuthContext"
import { StorageContext } from "./contexts/StorageContext"


function App() {
  const FBapp = initializeApp(FirebaseConfig)
  const FBauth = getAuth(FBapp)
  const FBdb = getFirestore(FBapp)
  const FBstorage = getStorage(FBapp)

  // navigation array
  const NavItems = [
    { label: "Home", link: "/Home" },
    { label: "About", link: "/about" },
    { label: "Contact", link: "/contact" },
    { label: "Create Account", link: "/signup" },
    { label: "Log in", link: "/signin" }
  ]
  // navigation for authenticated user

  const AuthNavItems = [
    { label: "Home", link: "/Home" },
    { label: "About", link: "/about" },
    { label: "Contact", link: "/contact" }
  ]

  // application states
  const [nav, setNav] = useState(NavItems)
  const [auth, setAuth] = useState(false)
  const [data, setData] = useState([])
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (data.length === 0 && fetching === false) {
      readData()
      setFetching(true)
    }
  }, [data])

  // authentication observer
  onAuthStateChanged(FBauth, (user) => {
    if (user) {
      // currently authenticated
      setAuth(user)
      setNav(AuthNavItems)
    }
    else {
      // currently unauthenticated
      setAuth(false)
      setNav(NavItems)
    }
  })

  // signing up a user
  const signUp = (email, password) => {
    createUserWithEmailAndPassword(FBauth, email, password)
      .then((userCredential) => {
        // do something
      })
      .catch((error) => console.log(error.message))
  }
  // logging a user out
  const logOut = () => {
    signOut(FBauth).then(() => {
      // user is signed out
    })
  }
  // signing in a user
  const signIn = (email, password) => {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(FBauth, email, password)
        .then(() => {
          // user is signed in
          resolve(true)
        })
        .catch((error) => {
          console.log(error)
          reject(error.code)
        })
    })
  }

  // function to get data
  const readData = async () => {
    const querySnapshot = await getDocs(collection(FBdb, "books"))
    let listdata = []
    querySnapshot.forEach((doc) => {
      let item = doc.data()
      item.id = doc.id
      listdata.push(item)
    })
    setData(listdata)
  }

  // function to get a single item
  const getDocument = async ( itemId ) => {
    const docRef = doc( FBdb, "books", itemId )
    const docSnap = await getDoc( docRef )
    let book = docSnap.data()
    book.id = itemId
    return book
  }

  const dataBatch = async (data) => {
    const batch = writeBatch(FBdb)
    // loop through data
    for (let i = 0; i < data.length; i++) {
      const ref = doc(collection(FBdb, "books"))
      batch.set(ref, data[i])
    }
    batch.commit().then((res) => console.log(res))
  }

  return (
    <div className="App">
      <Header items={nav} user={auth} />
      <AuthContext.Provider value={auth}>
        <StorageContext.Provider value={FBstorage}>
          <Routes>
            <Route path="/Home" element={<Home items={data} />} />
            <Route path="/about" element={<About add={dataBatch} greeting="Hey you, this is about page!"  />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup handler={signUp} />} />
            <Route path="/signout" element={<Signout handler={logOut} />} />
            <Route path="/signin" element={<Signin handler={signIn} authstate={auth} />} />
            <Route path="/detail/:id/:title" element={<Detail handler={getDocument} />} />
          </Routes>
        </StorageContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;