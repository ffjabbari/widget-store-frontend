import { Container, Row, Col } from 'react-bootstrap';
import { Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';

// local imports
import Navbar from '../../components/Navbar/Navbar';
import LoginSignup from '../../components/LoginSignup/LoginSignup';
import CartList from '../../components/common/CartList/CartList';
import CheckoutForms from '../../components/CheckoutForms/CheckoutForms';
import ProductDetail3 from '../../components/ProductDetail/ProductDetail3/ProductDetail3';
import PanelClose from '../../components/common/PanelClose/PanelClose';
import pageScrollTopHook from '../../hooks/pageScrollTopHook';
import { calculateTax, calculateTotal } from '../../utils/moneyFuncts';
import './Checkout.css';

const Checkout = () => {
  // composite order data for checkout steps
  const [orderData, setOrderData] = useState({});
  // disabled flag for disabling CartList cart adjustment
  const [disabled, setDisabled] = useState(false);
  // selected ID for shared layout animation
  const [selectedId, setSelectedId] = useState(null);

  const subtotal = useSelector(state => state.cart.subtotal);
  const history = useHistory();

  // scroll to top of page with load.
  // needed for mobile behavior.
  pageScrollTopHook();

  // When cart state changes...
  //
  // Recalculate tax and total based on the changed cart data.
  // Set orderData.shipping to false to disallow navigating to shipping step
  // to force a shipping cost recalculation.
  useEffect(() => {
    setOrderData(orderData => ({
      ...orderData,
      shipping: false,
      // if customer data calculate tax else return 0
      tax: orderData.customer
        ? calculateTax(subtotal, orderData.customer.state)
        : 0,
      total: calculateTotal(subtotal, orderData.customer?.state),
    }));
  }, [subtotal]);

  const handleClose = () => {
    history.push('/shop');
  };

  return (
    <AnimateSharedLayout type="crossfade">
      <div className="Checkout text-light">
        <Navbar />
        <motion.div
          initial={{ y: '-100vh', opacity: 0 }}
          animate={{ y: '0vh', opacity: 1 }}
          exit={{ y: '100vh', opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Container
            fluid="xl"
            className="Checkout-panel panel-border dark-gradient-1 my-4 px-0 pt-3 position-relative"
          >
            <PanelClose closeFunct={handleClose} />
            <h1 className="brand-style display-3 textShadowLarge">Checkout</h1>

            <Row className="mx-0">
              <Col xs="12" lg="6" className="cart-col py-2 py-lg-3 px-0">
                <CartList
                  disabled={disabled}
                  orderData={orderData}
                  setSelectedId={setSelectedId}
                />
              </Col>
              <Col xs="12" lg="6" className="px-3 px-sm-4 py-lg-3">
                <CheckoutForms
                  setDisabled={setDisabled}
                  orderData={orderData}
                  setOrderData={setOrderData}
                />
              </Col>
            </Row>
          </Container>
        </motion.div>

        <Route exact path={`/checkout/login`}>
          <LoginSignup />
        </Route>
      </div>
      <AnimatePresence>
        {selectedId && (
          <ProductDetail3
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            disabled={disabled}
          />
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};

export default Checkout;
