"use strict";
exports.__esModule = true;
var react_1 = require("@chakra-ui/react");
var theme_1 = require("../theme");
function MyApp(_a) {
    var Component = _a.Component, pageProps = _a.pageProps;
    return (<react_1.ChakraProvider resetCSS theme={theme_1["default"]}>
      <react_1.ColorModeProvider options={{
            useSystemColorMode: true,
        }}>
        <Component {...pageProps}/>
      </react_1.ColorModeProvider>
    </react_1.ChakraProvider>);
}
exports["default"] = MyApp;
