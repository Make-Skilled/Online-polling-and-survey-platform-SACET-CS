import { Routes, Route } from 'react-router-dom';
import { Layout, Home, NoPage, Login, Signup, VerifyEmail, ForgotPassword, ResetPassword, 
  PollLayout, Poll, Dashoard, CreatePoll, EditPoll, MyPolls, MyVotes, SavedPoll, MyFeeds, 
  AllPolls, AllUsers, MyProfile, Profile, IsAuthenticatedUser, CreateSurvey, MySurveys, 
  SurveyDetail } from './modules'
import { useUserInfo } from './contexts/UserContext';
import './App.css'
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { userInfo } = useUserInfo();
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Signup />} />
          <Route path='verify-email' element={<VerifyEmail />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path='poll' element={<IsAuthenticatedUser><PollLayout /></IsAuthenticatedUser>} >
            {/* Routing for internal polls. For the sidebar */}
            {userInfo?.role === 'admin' && (
              <>
                <Route index element={<AllPolls />} />
                <Route path="myfeeds" element={<MyFeeds />} />
                <Route path="all-users" element={<AllUsers />} />
              </>
            )}
            {userInfo?.role !== 'admin' && (
              <Route index element={<MyFeeds />} />
            )}
            <Route path='posts/:pollId' element={<Poll />} />
            <Route path='dashboard' element={<Dashoard />} />
            <Route path="create" element={<CreatePoll />} />
            <Route path='edit-poll/:id' element={<EditPoll />} />
            <Route path="my-poll" element={<MyPolls />} />
            <Route path="my-vote" element={<MyVotes />} />
            <Route path="saved-polls" element={<SavedPoll />} />
            <Route path="my_profile" element={<MyProfile />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route 
              path="create-survey" 
              element={
                <ErrorBoundary>
                  <CreateSurvey />
                </ErrorBoundary>
              } 
            />
            <Route path="my-surveys" element={<MySurveys />} />
            <Route path="survey/:id" element={<SurveyDetail />} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App


