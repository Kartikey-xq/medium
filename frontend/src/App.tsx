import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { AuthProvider } from './authContext'
import { CreateBlog } from './pages/CreateBlog'
import { Profile } from './pages/Profile'
import { AppLayout } from './Layouts/AppLayout'
import { ReadBlog } from './pages/ReadBlog'
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    <Toaster position="top-right"/>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<AppLayout />}>
                      <Route index element={<Navigate to="blogs" replace />} />
                      
            <Route path="blogs" element={<Blog />} />
            <Route path="blog/:id" element={<ReadBlog />} />
            <Route path="create" element={<CreateBlog />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </>
  );
}
export default App;

