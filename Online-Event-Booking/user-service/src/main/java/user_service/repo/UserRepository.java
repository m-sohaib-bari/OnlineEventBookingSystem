package user_service.repo;

import user_service.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    public User findByUsername(String username);
    public User findByEmail(String email);
    public boolean existsById(long id);
    public List<User> findByEmailIn(List<String> emails);
    // no custom method needed as of right now
}