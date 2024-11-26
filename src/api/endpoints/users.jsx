const usersEndpoints = (builder) => ({
  registerUser: builder.mutation({
    query: ({ username, email, password }) => ({
      url: '/users',
      method: 'POST',
      body: {
        user: {
          username,
          email,
          password,
        },
      },
    }),
  }),
  loginUser: builder.mutation({
    query: ({ email, password }) => ({
      url: '/users/login',
      method: 'POST',
      body: {
        user: {
          email,
          password,
        },
      },
    }),
  }),
  getCurrentUser: builder.query({
    query: (token) => ({
      url: '/user',
      headers: {
        Authorization: `Token ${token}`,
      },
    }),
  }),
  updateCurrentUser: builder.mutation({
    query: ({ token, user }) => ({
      url: '/user',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: {
        user: {
          ...user,
        },
      },
    }),
  }),
})

export default usersEndpoints
