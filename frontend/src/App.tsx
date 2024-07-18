import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { Blogs } from './pages/Blogs'
import { Publish } from './pages/Publish'
import { Landing } from './pages/Landing'
import { MyBlogs } from './pages/MyBlogs'
import { MyProfile } from './pages/MyProfile'
import { EditBlog } from './pages/EditBlogs'
import { UserProfile } from './pages/UserProfile'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/publish" element={<Publish/>}/> 
          <Route path='/myblogs' element={<MyBlogs/>}/> 
          <Route path='/profile' element={<MyProfile/>}/>
          <Route path='/edit/blog/:user/:id' element={<EditBlog/>}/>
          <Route path='/profile/:userID' element={<UserProfile/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App