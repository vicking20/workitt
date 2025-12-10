# utils/resume_validation.py
from marshmallow import Schema, fields, validate, ValidationError, EXCLUDE, RAISE

class PersonalInfoSchema(Schema):
    class Meta:
        unknown = EXCLUDE  # Allow extra UI fields if any, but ignore them
    
    firstName = fields.Str(validate=validate.Length(max=200), allow_none=True)
    lastName = fields.Str(validate=validate.Length(max=200), allow_none=True)
    title = fields.Str(validate=validate.Length(max=200), allow_none=True)
    email = fields.Str(validate=validate.Length(max=200), allow_none=True)
    phone = fields.Str(validate=validate.Length(max=50), allow_none=True)
    address = fields.Str(validate=validate.Length(max=500), allow_none=True)
    city = fields.Str(validate=validate.Length(max=200), allow_none=True)
    country = fields.Str(validate=validate.Length(max=200), allow_none=True)
    postalCode = fields.Str(validate=validate.Length(max=50), allow_none=True)
    linkedIn = fields.Str(validate=validate.Length(max=500), allow_none=True)
    website = fields.Str(validate=validate.Length(max=500), allow_none=True)

class WorkExperienceItemSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    id = fields.Str(allow_none=True)
    title = fields.Str(validate=validate.Length(max=200), allow_none=True)
    company = fields.Str(validate=validate.Length(max=200), allow_none=True)
    location = fields.Str(validate=validate.Length(max=200), allow_none=True)
    startDate = fields.Str(allow_none=True)
    endDate = fields.Str(allow_none=True)
    current = fields.Bool(load_default=False)
    description = fields.Str(validate=validate.Length(max=10000), allow_none=True)

class EducationItemSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    id = fields.Str(allow_none=True)
    school = fields.Str(validate=validate.Length(max=200), allow_none=True)
    degree = fields.Str(validate=validate.Length(max=200), allow_none=True)
    field = fields.Str(validate=validate.Length(max=200), allow_none=True)
    location = fields.Str(validate=validate.Length(max=200), allow_none=True)
    startDate = fields.Str(allow_none=True)
    endDate = fields.Str(allow_none=True)
    current = fields.Bool(load_default=False)
    description = fields.Str(validate=validate.Length(max=5000), allow_none=True)

class SkillItemSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    id = fields.Str(allow_none=True)
    name = fields.Str(validate=validate.Length(max=200), allow_none=True)
    level = fields.Str(validate=validate.Length(max=100), allow_none=True)

class CertificationItemSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    id = fields.Str(allow_none=True)
    name = fields.Str(validate=validate.Length(max=200), allow_none=True)
    issuer = fields.Str(validate=validate.Length(max=200), allow_none=True)
    date = fields.Str(allow_none=True)
    link = fields.Str(validate=validate.Length(max=500), allow_none=True)
    description = fields.Str(validate=validate.Length(max=5000), allow_none=True)

class LinkItemSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    id = fields.Str(allow_none=True)
    label = fields.Str(validate=validate.Length(max=200), allow_none=True)
    service = fields.Str(validate=validate.Length(max=200), allow_none=True)
    url = fields.Str(validate=validate.Length(max=500), allow_none=True)
    linkUrl = fields.Str(validate=validate.Length(max=500), allow_none=True)  # Frontend uses linkUrl

class OtherItemSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    id = fields.Str(allow_none=True)
    title = fields.Str(validate=validate.Length(max=200), allow_none=True)
    description = fields.Str(validate=validate.Length(max=10000), allow_none=True)
    content = fields.Str(validate=validate.Length(max=10000), allow_none=True)  # Frontend uses content

class StyleSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    fontFamily = fields.Str(load_default='font-sans')
    fontSize = fields.Float(load_default=11)
    headerFontColor = fields.Str(load_default='#1e293b')
    contentFontColor = fields.Str(load_default='#334155')
    lineSpacing = fields.Float(load_default=1.5)
    margins = fields.Float(load_default=8)
    paperSize = fields.Str(validate=validate.OneOf(['a4', 'letter']), load_default='a4')
    headerAlignment = fields.Str(validate=validate.OneOf(['left', 'center', 'right']), load_default='left')

class VisibilitySchema(Schema):
    class Meta:
        unknown = EXCLUDE
    # Allow flexible boolean dicts
    personalInfo = fields.Dict(keys=fields.Str(), values=fields.Bool())
    summary = fields.Bool()
    workExperience = fields.Dict(keys=fields.Str(), values=fields.Bool())
    education = fields.Dict(keys=fields.Str(), values=fields.Bool())
    skills = fields.Bool()
    certifications = fields.Dict(keys=fields.Str(), values=fields.Bool())
    links = fields.Bool()
    others = fields.Bool()

class ResumeContentSchema(Schema):
    class Meta:
        # Strictly reject unknown top-level sections
        unknown = RAISE
    
    personalInfo = fields.Nested(PersonalInfoSchema)
    summary = fields.Str(validate=validate.Length(max=10000), allow_none=True)
    workExperience = fields.List(fields.Nested(WorkExperienceItemSchema))
    education = fields.List(fields.Nested(EducationItemSchema))
    skills = fields.List(fields.Nested(SkillItemSchema))
    certifications = fields.List(fields.Nested(CertificationItemSchema))
    links = fields.List(fields.Nested(LinkItemSchema))
    others = fields.List(fields.Nested(OtherItemSchema))
    
    sectionOrder = fields.List(fields.Str())
    style = fields.Nested(StyleSchema)
    visibility = fields.Nested(VisibilitySchema)
    
    # Metadata
    title = fields.Str(validate=validate.Length(max=200), allow_none=True)
    templateId = fields.Str(validate=validate.Length(max=100), allow_none=True)

def validate_resume_data(data):
    """
    Validate resume content data and return cleaned data or raise ValidationError
    """
    schema = ResumeContentSchema()
    return schema.load(data)
