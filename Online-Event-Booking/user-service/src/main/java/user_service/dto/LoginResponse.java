package user_service.dto;

public class LoginResponse {
    private Long userId;
    private String email;
    private String message;

    public LoginResponse(Long userId, String email, String message) {
        this.userId = userId;
        this.email = email;
        this.message = message;
    }
}

