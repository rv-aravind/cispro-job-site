
'use client';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import LoginWithSocial from './LoginWithSocial';
import FormContent2 from './FormContent2';
import Link from 'next/link';

const Login = () => {
  return (
    <div className="form-inner">
      {/* <h3>Login Into the Account</h3> */}

      <Tabs>
        {/* <div className="form-group register-dual">
          <TabList className="btn-box row">
            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-user"></i> Candidate
              </button>
            </Tab>

            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-briefcase"></i> Employer
              </button>
            </Tab>
          </TabList>
        </div> */}

        <TabPanel>
          <FormContent2 role="candidate" />
        </TabPanel>

        <TabPanel>
          <FormContent2 role="employer" />
        </TabPanel>
      </Tabs>
{/* 
      <div className="bottom-box">
        <div className="text">
          Already have an account?{' '}
          <Link href="/login" className="call-modal login">
            LogIn
          </Link>
        </div>
        <div className="divider">
          <span>or</span>
        </div>
        <LoginWithSocial />
      </div> */}
    </div>
  );
};

export default Login;