# University Passkey Security Implementation

## Overview
University passkeys are now securely hashed before being stored in the database, ensuring that sensitive access codes cannot be compromised even if the database is accessed by unauthorized parties.

## Implementation Details

### Hashing Algorithm
- **Library:** `werkzeug.security`
- **Method:** PBKDF2-SHA256 (Password-Based Key Derivation Function 2 with SHA-256)
- **Salt:** Automatically generated unique salt for each passkey
- **Iterations:** Default secure iteration count (thousands of rounds)

### When Passkeys Are Hashed

1. **During CSV/Excel Upload**
   - Plain text passkeys from uploaded files are immediately hashed
   - Hashing occurs before database insertion
   - Original plain text is never stored

2. **During Manual Entry** (if implemented)
   - Any passkey entered through forms is hashed before storage

### How Verification Works

When a student or company needs to verify their university passkey:

1. User enters plain text passkey (e.g., "MIT2024")
2. Backend retrieves all universities from database
3. Uses `check_password_hash()` to compare entered passkey against each hashed passkey
4. If match found, returns university details
5. If no match, returns "Invalid passkey" error

**Endpoint:** `POST /api/universities/verify-passkey`

### Code Changes

#### Backend Routes (`backend/app/universiytyDbUpdate/routes.py`)

```python
from werkzeug.security import generate_password_hash, check_password_hash

# When uploading universities
hashed_passkey = generate_password_hash(passkey)
new_uni = universitytable(
    universityName=university_name,
    passkey=hashed_passkey  # Stored as hash
)

# When verifying passkey
for university in universities:
    if check_password_hash(university.passkey, entered_passkey):
        return university_details
```

## Security Benefits

1. **Data Breach Protection**
   - Even if database is compromised, passkeys cannot be read
   - Attackers cannot reverse-engineer the hash to get original passkey

2. **Rainbow Table Resistance**
   - Unique salt for each passkey prevents rainbow table attacks
   - Same passkey for different universities produces different hashes

3. **Brute Force Protection**
   - High iteration count makes brute force attacks computationally expensive
   - Each attempt takes significant processing time

4. **Industry Standard**
   - Uses the same hashing method as user passwords
   - Follows OWASP security guidelines

## Display in Admin Panel

When viewing universities in the admin dashboard:
```json
{
  "id": 1,
  "universityName": "MIT",
  "passkey": "********"  // Hidden for security
}
```

The actual hashed value in database looks like:
```
pbkdf2:sha256:600000$random_salt$long_hash_string
```

## Testing Passkey Verification

### Test Case 1: Valid Passkey
```bash
curl -X POST http://localhost:5000/api/universities/verify-passkey \
  -H "Content-Type: application/json" \
  -d '{"passkey": "MIT2024"}'
```

Expected Response:
```json
{
  "success": true,
  "message": "Passkey verified successfully",
  "university": {
    "id": 1,
    "universityName": "MIT"
  }
}
```

### Test Case 2: Invalid Passkey
```bash
curl -X POST http://localhost:5000/api/universities/verify-passkey \
  -H "Content-Type: application/json" \
  -d '{"passkey": "WRONG2024"}'
```

Expected Response:
```json
{
  "success": false,
  "message": "Invalid passkey"
}
```

## Migration Considerations

### Existing Data
If you have existing universities with plain text passkeys in the database:

1. **Option 1: Re-upload via CSV**
   - Export existing universities to CSV with plain text passkeys
   - Delete old universities
   - Upload CSV - passkeys will be hashed automatically

2. **Option 2: Migration Script**
   - Create a script to hash existing passkeys in place
   - Backup database before running

Example migration script:
```python
from app import create_app, db
from app.models import universitytable
from werkzeug.security import generate_password_hash

app = create_app()
with app.app_context():
    universities = universitytable.query.all()
    for uni in universities:
        # Only hash if not already hashed
        if not uni.passkey.startswith('pbkdf2:'):
            uni.passkey = generate_password_hash(uni.passkey)
    db.session.commit()
    print("Migration complete!")
```

## Best Practices

1. **Never Log Passkeys**
   - Don't log plain text passkeys in server logs
   - Don't display in error messages
   - Don't send in response bodies (except for verification endpoint)

2. **Passkey Requirements**
   - Recommend strong passkeys (8+ characters)
   - Mix of letters and numbers
   - Unique per university

3. **Regular Security Audits**
   - Periodically review access logs
   - Monitor verification attempts
   - Implement rate limiting on verification endpoint

4. **Backup Security**
   - Ensure database backups are encrypted
   - Limit access to backup files
   - Secure backup storage locations

## Future Enhancements

Potential security improvements:
- [ ] Rate limiting on passkey verification endpoint
- [ ] Logging of failed verification attempts
- [ ] Account lockout after multiple failed attempts
- [ ] Two-factor authentication for university registration
- [ ] Passkey expiration and rotation policy
- [ ] Audit trail for passkey changes

## Support and Questions

For security-related questions or concerns:
1. Review this document thoroughly
2. Check the main UNIVERSITY_MANAGEMENT.md for usage
3. Ensure all dependencies are up to date
4. Follow security best practices for deployment

## Related Files

- [backend/app/universiytyDbUpdate/routes.py](backend/app/universiytyDbUpdate/routes.py) - Main implementation
- [UNIVERSITY_MANAGEMENT.md](UNIVERSITY_MANAGEMENT.md) - Feature documentation
- [backend/requirements.txt](backend/requirements.txt) - Dependencies
- [backend/sample_universities.csv](backend/sample_universities.csv) - Sample data

---

**Note:** This security implementation ensures that university passkeys are protected using industry-standard cryptographic hashing, making the system resistant to common attack vectors while maintaining usability for legitimate verification purposes.
