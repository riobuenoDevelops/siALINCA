import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Header,
  Content,
  Sidebar,
  Icon,
  IconButton
} from 'rsuite';

import CustomHeader from '../customComponents/CustomHeader';
import SideNavbar from './SideNavbar';

//Styles
import '../../styles/logged-layout.less';
import { useCurrentUser } from '../../hooks';

const LoggedLayout = ({
                        children
                      }) => {
  const router = useRouter();
  const [isLogged, handleLogged] = useState(false);
  const [expanded, handleExpanded] = useState(true);
  const [userModalIsOpen, handleUserModalOpen] = useState(false);
  const [storeModalIsOpen, handleStoreModalOpen] = useState(false);
  const [sedeModalIsOpen, handleSedeModalOpen] = useState(false);
  const [applicantModalIsOpen, handleApplicantModalOpen] = useState(false);
  const [ablyClient, setAblyClient] = useState({});
  const { user, isEmpty } = useCurrentUser();

  const onHandleExpanded = () => {
    handleExpanded(!expanded);
  };

  useEffect(() => {
    if (isEmpty) {
      router.push('/login');
    }
  }, []);

  return (
    <Container className="logged-layout-container">
      <Sidebar
        className="logged-layout-sidebar"
        style={{ display: isLogged ? 'flex' : 'none' }}
        width={expanded ? 260 : 56}
        collapsible
      >
        <div
          style={{
            width: '100%',
            minHeight: '5em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: '2em',
            paddingLeft: '.68em'
          }}
        >
          <IconButton
            icon={<Icon icon="bars" size="lg" style={{ color: 'white' }}/>}
            appearance="primary"
            onClick={onHandleExpanded}
          />
        </div>
        <SideNavbar
          roleName={user?.user?.roleName}
          expanded={expanded}
          router={router}
        />
      </Sidebar>
      <Container className="logged-layout-content-container">
        <Header
          className="logged-layout-header"
          style={{ display: isLogged ? 'initial' : 'none' }}
        >
          <CustomHeader
            handleUserModalOpen={handleUserModalOpen}
            handleStoreModalOpen={handleStoreModalOpen}
            handleSedeModalOpen={handleSedeModalOpen}
            handleApplicantModalOpen={handleApplicantModalOpen}
            user={user}
            router={router}
            expanded={expanded}
            handleLogged={handleLogged}
            ablyClient={ablyClient}
          />
        </Header>
        <Content
          className={
            isLogged
              ? 'logged-layout-content'
              : 'logged-layout-content-container'
          }
        >
          {React.cloneElement(children, {
            isLogged,
            handleLogged,
            user,
            handleUserModalOpen,
            handleStoreModalOpen,
            handleSedeModalOpen,
            handleApplicantModalOpen,
            userModalIsOpen,
            storeModalIsOpen,
            sedeModalIsOpen,
            applicantModalIsOpen
          })}
        </Content>
      </Container>
    </Container>
  );
};

export default LoggedLayout;
