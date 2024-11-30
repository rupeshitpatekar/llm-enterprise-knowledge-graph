from datetime import date
from backend.agentic_rag_service.src import Neo4jApp

class MemberEntity:
    def __init__(self, memberName, email, phone, department, role, yearsOfExperience, achievements, memberId=None):
        self.memberName = memberName
        self.email = email
        self.phone = phone
        self.department = department
        self.role = role
        self.yearsOfExperience = yearsOfExperience
        self.achievements = achievements
        self.memberId = memberId or str(uuid.uuid4())

    def save(self, app: Neo4jApp):
        query = """
        CREATE (m:Member {
            memberName: $memberName,
            email: $email,
            phone: $phone,
            department: $department,
            role: $role,
            yearsOfExperience: $yearsOfExperience,
            achievements: $achievements,
            memberId: $memberId
        })
        RETURN m
        """
        parameters = {
            "memberName": self.memberName,
            "email": self.email,
            "phone": self.phone,
            "department": self.department,
            "role": self.role,
            "yearsOfExperience": self.yearsOfExperience,
            "achievements": self.achievements,
            "memberId": self.memberId
        }
        return app.run_query(query, parameters)

    @staticmethod
    def find_by_id(app: Neo4jApp, memberId):
        query = """
        MATCH (m:Member {memberId: $memberId})
        RETURN m
        """
        parameters = {"memberId": memberId}
        result = app.run_query(query, parameters)
        if result:
            record = result[0]["m"]
            return MemberEntity(
                memberName=record["memberName"],
                email=record["email"],
                phone=record["phone"],
                department=record["department"],
                role=record["role"],
                yearsOfExperience=record["yearsOfExperience"],
                achievements=record["achievements"],
                memberId=record["memberId"]
            )
        return None