// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RecordingDetailsPage } from '../domain/recording/pages';
import { ROUTES } from '../routes';

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <>
      {/* <Example /> */}
      <Routes>
        <Route
          path={ROUTES.index.root}
          element={
            <main className="flex justify-center items-center w-full h-screen bg-slate-800">
              <h1 className="text-3xl text-center text-white">Snifferchina</h1>
            </main>
          }
        >
          <Route
            path={ROUTES.recording.details.template}
            element={<RecordingDetailsPage />}
          />
        </Route>
        <Route path={ROUTES.recording.root}>
          <Route
            path={ROUTES.recording.details.template}
            element={<RecordingDetailsPage />}
          />
        </Route>
      </Routes>
      {/* <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes> */}
      {/* END: routes */}
    </>
  );
}

export default App;
