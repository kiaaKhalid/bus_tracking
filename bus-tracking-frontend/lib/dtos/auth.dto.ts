export interface LoginDto {
    email: string
    password: string
  }
  
  export interface SignupDto {
    email: string
    password: string
    name: string
  }
  
  export interface SendResetCodeDto {
    email: string
  }
  
  export interface VerifyResetCodeDto {
    email: string
    code: string
  }
  
  export interface ForgetPasswordDto {
    email: string
    code: string
    newPassword: string
    confirmPassword: string
  }
  
  export interface UserResponse {
    id: string
    email: string
    role: "admin" | "operator" | "viewer"
    name: string
    avatar?: string
    avatarUrl?: string
  }
  
  export interface AuthResponse {
    accessToken: string
    user: UserResponse
  }
  
  export interface RefreshResponse {
    accessToken: string
    user: UserResponse
  }
  
  export interface SuccessResponse {
    success: boolean
    message?: string
  }
  
  export interface VerifyCodeResponse {
    valid: boolean
  }
  