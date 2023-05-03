import { ConnectButton } from '@rainbow-me/rainbowkit';
import { read } from 'fs';
import { forEach } from 'lodash';
import { MDXRemote } from 'next-mdx-remote';
import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

// import { Affix } from 'antd';
import { Box, Hidden, Link, Skeleton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Container from '../components/Container';
import Diploma from '../components/Diploma';
import MintBadge from '../components/MintBadge';
import ZksyncSwap from '../components/ZksyncSwap';
import CompressText from '../components/animation/CompressText';
import { MobileDirectory, PcDirectory } from './Directory';
import Loading from './Loading';
import Progress from './Progress';
import TabChapter from './TabChapter';
import { ReadContext } from './context.js';
import mdxStyle from './mdx.module.css';
import { getStorage, removeStorage, setStorage } from './storage.js';

const ImpossibleTriangle = dynamic(() => import('../components/ImpossibleTriangle'), { ssr: false });

export default function Content(props) {
  const { md } = props;

  const chapterCount = md.props.file.length - 4;
  const [name, setName] = useState(md.props.file[0]?.text);
  const [readData, setReadData] = useState({
    counter: chapterCount,
    read: 1,
    currentIndex: 0,
    actionFrom: 'nextButton',
  });
  const [mdxSource, setMdxSource] = useState('');

  const [directory, setDirectory] = useState(md.props.file);
  const [readStatus, setReadStatus] = useState([true]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [chapterData, setChapterData] = useState({
    current: directory[0].text,
    last: '',
    next: directory[2].text,
  });
  const [isLoading, setLoading] = useState(false);
  const { ref, inView, entry } = useInView({
    threshold: 0.3,
  });
  // const elementRef = useRef(null);
  // const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    requestMdxSource(name);

    // setChapterData({
    //   current: chapterData?.current, //md.props.file[readData?.currentIndex]?.text,
    //   last: chapterData?.last,//readData?.currentIndex !== 1 ? md.props.file[readData?.currentIndex - 1]?.text : '',
    //   next: chapterData?.next,//readData?.currentIndex !== readData.counter ? md.props.file[readData?.currentIndex + 1]?.text : '',
    // });
  }, [name]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           setIsIntersecting(true)
  //           console.log('Element is visible');
  //           // Do something when element is visible
  //         } else {
  //           setIsIntersecting(false)

  //         }
  //       });
  //     },
  //     { threshold: 0.5 }
  //   );

  //   if (elementRef.current) {
  //     observer.observe(elementRef.current);
  //   }

  //   return () => {
  //     observer.unobserve(elementRef.current);
  //   };
  // }, []);

  console.log('shuang seee', selectedIndex);
  const requestMdxSource = (name) => {
    setLoading(true);

    fetch(`/api/getFile/${name}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data------------', data);
        if (data?.mdxSource) {
          setMdxSource(data.mdxSource);
        }
        setTimeout(() => setLoading(false), 800);
      })
      .catch((error) => console.error('err--------', error));
  };

  // const computeReadCount = (arr) => arr?.reduce((acc, cur) => acc + (cur ? 1 : 0), 0) || 1;

  const computeReadCount = (arr) => {
    let count = 0;
    for (let index in arr) {
      if ((!arr[index].main && arr[index]?.status) || (arr[index].main && (+index === 0 || +index === arr.length - 1) && arr[index]?.status)) {
        console.log('arr', arr[index]);
        count++;
      }
    }
    return count;
  };
  const handleTabChapter = (action, chapter) => {
    const mainArr = [1, 5, 10, 18];

    if (!action) {
      return;
    }
    const targetElement = document.getElementById('root');
    targetElement.scrollIntoView({ behavior: 'smooth' });

    let readStatusStore = readStatus;

    if (action === 'last') {
      if (selectedIndex === 1) {
        return;
      }

      if (readStatusStore[readData?.currentIndex - 1] !== true) {
        readStatusStore[readData?.currentIndex - 1] = true;
        setReadStatus(readStatusStore);
        computeReadCount(readStatusStore);
      }

      let newState = directory;

      if (mainArr.includes(selectedIndex - 1)) {
        newState[selectedIndex - 1] = {
          text: newState[selectedIndex - 1]?.text,
          main: true,
          index: selectedIndex - 1,
          status: true,
        };

        newState[selectedIndex - 2] = {
          text: newState[selectedIndex - 2]?.text,
          main: false,
          index: selectedIndex - 2,
          status: true,
        };

        setChapterData({
          current: directory[selectedIndex - 2]?.text,
          last: mainArr.includes(selectedIndex - 1) ? directory[selectedIndex - 3]?.text : directory[selectedIndex - 2]?.text,
          next: directory[selectedIndex]?.text,
        });
        setSelectedIndex(selectedIndex - 2);

        setName(newState[selectedIndex - 2]?.text);
      } else {
        console.log('shuang --selectedIndex', selectedIndex);
        setChapterData({
          current: directory[selectedIndex - 1]?.text,
          last: selectedIndex - 2 === 0 ? '' : mainArr.includes(selectedIndex - 2) ? directory[selectedIndex - 3]?.text : directory[selectedIndex - 2]?.text,
          next: directory[selectedIndex]?.text,
        });
        newState[selectedIndex - 1] = {
          text: newState[selectedIndex - 1]?.text,
          main: false,
          index: selectedIndex - 1,
          status: true,
        };
        setSelectedIndex(selectedIndex - 1);

        setName(newState[selectedIndex - 1]?.text);
      }

      setDirectory(newState);

      // setName(chapterData?.last);
      // setSelectedIndex(readData?.currentIndex - 1);

      setReadData({
        counter: chapterCount,
        read: computeReadCount(newState),
        currentIndex: readData?.currentIndex - 1,
        actionFrom: 'nextButton',
      });
    }
    if (action === 'next') {
      if (selectedIndex === chapterCount + 3) {
        return;
      }
      if (readStatusStore[readData?.currentIndex + 1] !== true) {
        readStatusStore[readData?.currentIndex + 1] = true;
        setReadStatus(readStatusStore);
        computeReadCount(readStatusStore);
      }
      let newState = directory;
      let nextChapter = directory[selectedIndex + 1];
      if (mainArr.includes(selectedIndex + 1)) {
        newState[selectedIndex + 1] = {
          text: newState[selectedIndex + 1]?.text,
          main: true,
          index: selectedIndex + 1,
          status: true,
        };

        newState[selectedIndex + 2] = {
          text: newState[selectedIndex + 2]?.text,
          main: false,
          index: selectedIndex + 2,
          status: true,
        };

        setChapterData({
          current: directory[selectedIndex + 2]?.text,
          last: selectedIndex !== 1 ? directory[selectedIndex]?.text : '',
          next: selectedIndex !== chapterCount ? directory[selectedIndex + 3]?.text : '',
        });
        setSelectedIndex(selectedIndex + 2);

        setName(newState[selectedIndex + 2]?.text);
      } else {
        console.log('--selectedIndex', selectedIndex);
        setChapterData({
          current: directory[selectedIndex + 1]?.text,
          last: directory[selectedIndex]?.text,
          next: mainArr.includes(selectedIndex + 2) ? directory[selectedIndex + 3]?.text : directory[selectedIndex + 2]?.text,
        });

        newState[selectedIndex + 1] = {
          text: newState[selectedIndex + 1]?.text,
          main: false,
          index: selectedIndex + 1,
          status: true,
        };
        setSelectedIndex(selectedIndex + 1);

        setName(newState[selectedIndex + 1]?.text);
      }

      setDirectory(newState);
      // setName(chapterData?.next);
      // setSelectedIndex(selectedIndex + 1);

      // setReadData({
      //   counter: chapterCount,
      //   read: computeReadCount(newState),
      //   currentIndex: mainArr.includes(chapter?.index) ? chapter?.index + 1 : chapter?.index,
      //   actionFrom: 'nextButton',
      // });

      setReadData({
        counter: chapterCount,
        read: computeReadCount(newState),
        currentIndex: mainArr.includes(selectedIndex + 1) ? selectedIndex + 2 : selectedIndex + 1,
        actionFrom: 'nextButton',
      });
    }
    if (action === 'lastOrNext') {
      let newState = directory;
      let params = {};

      if (mainArr.includes(chapter?.index)) {
        if (!chapter?.status) {
          params = {
            ...directory[chapter?.index + 1],
          };

          newState[chapter.index + 1] = {
            text: newState[chapter.index + 1]?.text,
            main: false,
            index: chapter.index + 1,
            status: true,
          };
        }
        setChapterData({
          current: newState[chapter?.index + 1].text,
          last: chapter?.index === 0 ? '' : newState[chapter.index - 1].text,
          next: newState[chapter.index + 2].text,
        });
        setSelectedIndex(chapter?.index + 1);

        setName(newState[chapter.index + 1]?.text);
      } else if(chapter.index === 0) {
        if (!chapter?.status) {
          setChapterData({
            current: newState[chapter?.index].text,
            last: '',
            next: newState[chapter.index + 2].text,
          });
          setSelectedIndex(chapter?.index);
  
          setName(newState[chapter.index]?.text);
        }
      } else {
        if (!chapter?.status) {
          if (chapter?.index > mainArr[1] && chapter?.index < mainArr[2]) {
            newState[mainArr[1]] = {
              ...newState[mainArr[1]],
              status: true,
            };
          }

          if (chapter?.index > mainArr[2] && chapter?.index < mainArr[3]) {
            newState[mainArr[2]] = {
              ...newState[mainArr[2]],
              status: true,
            };
          }

          if (chapter?.index > mainArr[3]) {
            newState[mainArr[3]] = {
              ...newState[mainArr[3]],
              status: true,
            };
          }

          if (chapter?.index === directory.length - 1) {
            newState[chapter?.index] = {
              ...newState[chapter?.index],
              status: true,
            };
          }
        }

        console.log('------newState', newState);
        console.log('-chapter?.index-', chapter?.index, chapterCount);
        setChapterData({
          current: newState[chapter?.index].text,
          last: chapter?.index - 1 === 0 ? '' : mainArr.includes(chapter?.index - 1) ? newState[chapter.index - 2].text : newState[chapter.index - 1].text,
          next: chapter?.index !== chapterCount + 3 && newState[chapter.index + 1].text,
        });
        setSelectedIndex(chapter?.index);

        setName(newState[chapter.index]?.text);
      }

      if (!chapter?.status) {
        newState[chapter.index] = {
          ...chapter,
          status: true,
        };

        setDirectory(newState);
      }

      setReadData({
        counter: chapterCount,
        read: computeReadCount(newState),
        currentIndex: mainArr.includes(chapter?.index) ? chapter?.index + 1 : chapter?.index,
        actionFrom: 'nextButton',
      });
    }
  };

  const components = {
    Diploma,
    CompressText,
    ZksyncSwap,
    ImpossibleTriangle,
    MintBadge,
  };

  const theme = useTheme();
  // console.log('theme.palette?.mode', theme.palette?.mode);
  const mdScreen = useMediaQuery(theme.breakpoints.up('md'));

  // console.log('mdScreen', mdScreen);

  useEffect(() => {
    const readed = directory.reduce((acc, cur) => {
      acc += cur.status;
      return acc;
    }, 0);
    console.log(readed);
    if (readed > 2) {
      setStorage('directoryStatus', JSON.stringify({ data: directory }));
    }
    if (selectedIndex > 1) {
      setStorage('selectedIndex', JSON.stringify({ data: selectedIndex }));
    }
  }, [directory, selectedIndex]);

  useEffect(() => {
    const directoryStatus = getStorage('directoryStatus');
    const selectedIndexStore = getStorage('selectedIndex');
    const jsonDirectory = JSON.parse(directoryStatus).data;
    const jsonSelect = JSON.parse(selectedIndexStore).data;
    if (directoryStatus) {
      setDirectory(JSON.parse(directoryStatus).data);
    }
    if (selectedIndexStore) {
      setSelectedIndex(JSON.parse(selectedIndexStore).data);

      setName(jsonDirectory[jsonSelect]?.text);
      setReadData({
        counter: chapterCount,
        read: computeReadCount(jsonDirectory),
        currentIndex: jsonSelect.data,
        actionFrom: 'nextButton',
      });
    }
  }, []);

  return (
    <ReadContext.Provider value={{ readData, setReadData }}>
      <Link id="content" sx={{ position: 'relative', top: '-80px' }}></Link>
      <Typography id={'root'}></Typography>
      {/* <Box sx={{background: 'green', display: 'flex' }}> */}

        <Container paddingX={2}>
          <Box
            ref={ref}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
  
            {/* {
              isIntersecting ? (
                <Box>
                  <Hidden smDown>
                      <PcDirectory directory={directory} readStatus={readStatus} selectedIndex={selectedIndex} onTabChapter={handleTabChapter}></PcDirectory>
                    </Hidden>
                </Box>
              ) : (
                <Affix>
                      <Hidden smDown>
                        <PcDirectory directory={directory} readStatus={readStatus} selectedIndex={selectedIndex} onTabChapter={handleTabChapter}></PcDirectory>
                      </Hidden>
                    </Affix >
              )
            } */}

            <Hidden smDown>
              <Box sx={{
                // position: isIntersecting ? 'fixed' : 'static',
                top: 0,
              }}>
                <PcDirectory directory={directory} readStatus={readStatus} selectedIndex={selectedIndex} onTabChapter={handleTabChapter}></PcDirectory>
              </Box>
            </Hidden>
    
            {isLoading ? (
              <Skeleton
                animation="wave"
                variant="rect"
                width={mdScreen ? '1200px' : '100vw'}
                sx={{
                  height: '100vh',
                  marginLeft: mdScreen ? '32px' : 0,
                  
                }}
              >
                <Box className={mdxStyle.root} textDecoration={'none'}>
                  {mdxSource && <MDXRemote components={components} {...mdxSource}></MDXRemote>}
                </Box>
              </Skeleton>
            ) : (
              <Box
                sx={{
                  // marginRight: mdScreen ? '32px' : 0,
                  flexGrow: 1,
                  marginLeft: mdScreen ? '32px' : 0,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    backgroundColor: theme.palette?.mode === 'dark' ? '#0F0F0F' : '#fff',
                    maxWidth: mdScreen ? '1200px' : '100vw',
                    color: theme.palette?.mode === 'dark' ? '#fff' : '#000',
                  }}
                  borderRadius={2}
                  padding={{
                    xs: 2,
                    sm: 8,
                  }}
                >
                  <Box className={mdxStyle.root} textDecoration={'none'}>
                    {mdxSource && <MDXRemote components={components} {...mdxSource}></MDXRemote>}
                  </Box>
                </Box>
                {/* <div ref={elementRef}> */}
                  <TabChapter marginTop={{ xs: '15px', sm: '32px' }} chapterData={{ ...chapterData, currentIndex: readData?.currentIndex, read: readData?.read, counter: readData?.counter }} onTabChapter={handleTabChapter}></TabChapter>
                {/* </div> */}
              </Box>
            )}

          </Box>
        </Container>
      {/* </Box> */}
      {inView && (
        <Hidden smUp>
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              top: 'auto',
              width: '100vw',
              zIndex: '1',
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 1)',
            }}
            backgroundColor="#FFFFFF"
            display="flex"
            height={80}
            alignItems="center"
            justifyContent="space-around"
            marginTop={4}
            paddingX={2}
          >
            <Box>
              <ConnectButton />
            </Box>
            <Box flexGrow={2} marginX="20px">
              <Progress />
            </Box>
            <Hidden smUp>
              <MobileDirectory directory={directory} readStatus={readStatus} selectedIndex={selectedIndex} onTabChapter={handleTabChapter}></MobileDirectory>
            </Hidden>
          </Box>
        </Hidden>
      )}
    </ReadContext.Provider>
  );
}
