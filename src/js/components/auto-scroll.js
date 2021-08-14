import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import CustomScroll from 'react-custom-scroll';

const AutoScroll = ({
  scrollToSelector,
  flex,
  heightRelativeToParent,
  keepAtBottom,
  bottomSelector,
  children,
}) => {
  const scrollRef = useRef();

  const outerHeight = useRef(0);
  const outerWidth = useRef(0);

  const shouldScrollDown = keepAtBottom && scrollRef.current.ref;

  const handleResize = () => scrollRef?.current?.forceUpdate();
  const scrollTo = (selector) => {
    const scroll = scrollRef.current;
    const container = scroll.innerContainerRef.current;
    const node = container.querySelector(selector);

    if (!node) return;

    // We need to wait for child components to render
    // This is probably a bad solution
    setTimeout(() => {
      scroll.updateScrollPosition(node.offsetTop - container.offsetTop);
    }, 10);
  };

  useEffect(() => {
    if (scrollToSelector) {
      scrollTo(scrollToSelector);
    } else if (shouldScrollDown) {
      scrollToSelector(bottomSelector);
    }
  }, []);

  useEffect(() => {
    if (scrollToSelector) {
      scrollTo(scrollToSelector);// check, maybe we shouldn't to it in constructor anymore
    }
  }, [scrollToSelector]);

  const containerStyle = {
    ...(flex && { flex }),
    ...(heightRelativeToParent && { height: heightRelativeToParent }),
  };

  return (
    <Measure onResize={handleResize}>
      {({
        contentRect: { entry },
        measureRef: outerMeasureRef,
      }) => {
        if (entry.height !== outerHeight.current || entry.width !== outerWidth.current) {
          outerHeight.current = entry.height;
          outerWidth.current = entry.width;
          if (shouldScrollDown) {
            scrollToSelector(bottomSelector);
          }
        }

        return (
          <div ref={outerMeasureRef} style={containerStyle} className="scroll-outer">
            <CustomScroll
              ref={scrollRef}
              flex="1 1 0"
              keepAtBottom={keepAtBottom}
              bottomSelector={bottomSelector}
            >
              <Measure onResize={handleResize}>
                {({ measureRef }) => (
                  <div ref={measureRef}>{children}</div>
                )}
              </Measure>
            </CustomScroll>
          </div>
        );
      }}
    </Measure>
  );
};

AutoScroll.defaultProps = {
  scrollToSelector: null,
  flex: null,
  heightRelativeToParent: null,
  keepAtBottom: false,
  bottomSelector: '* + :last-child',
};

AutoScroll.propTypes = {

  scrollToSelector: PropTypes.string,
  flex: PropTypes.string,
  heightRelativeToParent: PropTypes.string,
  keepAtBottom: PropTypes.bool,
  bottomSelector: PropTypes.string,
};

export default AutoScroll;
