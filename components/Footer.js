import React from 'react';
import Mailchimp from 'react-mailchimp-form';
import styled from 'styled-components';

import { Box, Grid, Link, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import CommunityLinkGroup from './CommunityLinkGroup';
import Container from './Container';

const SignupFormWrapper = styled.div`
  & input,
  & button {
    font-size: 16px;
    line-height: 24px;
  }

  & input {
    width: 270px;
    height: 48px;
    padding: 12px 14px;
    margin-right: 16px;
    border: 0.5px solid #d0d5dd;
    border-radius: 6px;
  }

  & button {
    background: linear-gradient(90deg, #305fe8 0%, #3ad9e3 100%);
    padding: 12px 20px;
    outline: none;
    border: none;
    border-radius: 6px;
    color: #ffffff;
    cursor: pointer;
    line-height: 24px;
  }
  @media (max-width: 600px) {
    & button {
      margin-top: 20px;
    }
  }
  & .msg-alert > p {
    color: #00fb8c !important;
  }
`;

const NavList = ({ title, items }) => (
  <Box display="flex" flexDirection="column">
    <Typography variant="h6" lineHeight="58px" fontWeight={700}>
      {title}
    </Typography>
    {items.map((item, index) => {
      return (
        <Link target="_blank" href={item.link} sx={{ textDecoration: 'none' }} key={index}>
          <Typography color="#646F7C" variant="body1" lineHeight="40px" fontWeight={400}>
            {item.name}
          </Typography>
        </Link>
      );
    })}
  </Box>
);

const Footer = () => {
  const theme = useTheme();
  return (
    <Box sx={{ background: '#ffffff' }} width="100%">
      <Container paddingY={{ md: '50px', xs: '44px' }} margin="0 auto">
        <Box display="flex" flexDirection={{ lg: 'row', md: 'column', xs: 'column' }}>
          <Grid container spacing={{ lg: 6, md: 12, xs: 12 }} flex={2}>
            <Grid item lg={4} md={4} xs={6}>
              <NavList
                title="My First Series"
                items={[
                  {
                    name: 'My First NFT',
                    link: 'https://github.com/lxdao-official/LXDAO-Developer-Guide',
                  },
                  {
                    name: 'My First Layer2',
                    link: '',
                  },
                ]}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={6}>
              <NavList
                title="Buidl Together"
                items={[
                  { name: 'Join Us', link: 'https://www.lxdao.io/joinus' },
                  {
                    name: 'Github',
                    link: 'https://github.com/lxdao-official',
                  },
                  {
                    name: 'Donate',
                    link: '',
                  },
                ]}
              />
            </Grid>
            <Grid item lg={4} md={4} xs={6}>
              <NavList
                title="Resources"
                items={[
                  { name: 'Docs', link: 'https://forum.lxdao.io/' },
                  {
                    name: 'Blog',
                    link: 'https://lxdao.notion.site/',
                  },
                  { name: 'Forum', link: 'https://forum.lxdao.io/' },
                  {
                    name: 'Media Kit',
                    link: 'https://www.figma.com/file/kBSNRnzvDNyLX5SrM7P2Mh/LXDAO-Media-kit?node-id=2%3A15&t=Sbk019qSH9SwRL7y-0',
                  },
                ]}
              />
            </Grid>
          </Grid>
          <Box display="flex" gap="24px" flexDirection="column" marginTop={{ lg: 0, md: 8, xs: 8 }} flex={1}>
            <Box width="147px" height="58px" component={'img'} src={'/icons/lxdao-logo.svg'} />
            <Typography variant="body1" lineHeight="24px" fontWeight={400} color="#666F85" textTransform="uppercase">
              LXDAO is an <span style={{ color: '#3C7AFF' }}>R&D</span>
              -focused DAO in Web3
            </Typography>
            <CommunityLinkGroup marginBottom={0} />
            <SignupFormWrapper theme={theme}>
              <Mailchimp
                action="https://lxdao.us12.list-manage.com/subscribe/post?u=4e96be73f764bc67c7f964f51&amp;id=eaa29be54b"
                fields={[
                  {
                    name: 'EMAIL',
                    placeholder: 'Email',
                    type: 'email',
                    required: true,
                  },
                ]}
              />
            </SignupFormWrapper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
