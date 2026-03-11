const router = createBrowserRouter([
  {
    path: '/',
    element: <> <Navbar /> <Home /> <Footer /> </>
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/reverify',          // ✅ was /verify
    element: <Verify />
  },
  {
    path: '/verify',            // ✅ was /verify/:token
    element: <VerifyEmail />
  },
  {
    path: '/profile/:userId',
    element: <ProtectedRoute><Navbar /><Profile /></ProtectedRoute>
  },
  {
    path: '/products',
    element: <><Navbar /><Products /></>
  },
  {
    path: '/products/:id',
    element: <><Navbar /><SingleProduct /></>
  },
  {
    path: '/cart',
    element: <ProtectedRoute><Navbar /><Cart /></ProtectedRoute>
  },
  {
    path: '/address',
    element: <ProtectedRoute><AddressForm /></ProtectedRoute>
  },
  {
    path: '/order-success',
    element: <ProtectedRoute><OrderSuccess /></ProtectedRoute>
  },
  {
    path: '/orders',
    element: <ProtectedRoute><Navbar /><MyOrder /></ProtectedRoute>
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute adminOnly={true}><Navbar /><Dashboard /></ProtectedRoute>,
    children: [
      { path: "sales",                    element: <AdminSales /> },
      { path: "add-product",              element: <AddProduct /> },
      { path: "products",                 element: <AdminProduct /> },
      { path: "orders",                   element: <AdminOrders /> },
      { path: "users",                    element: <AdminUsers /> },
      { path: "users/orders/:userId",     element: <ShowUserOrders /> },
      { path: "users/:id",                element: <UserInfo /> },
    ]
  }
])

export default App;