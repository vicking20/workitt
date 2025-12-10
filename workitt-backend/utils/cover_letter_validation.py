# utils/cover_letter_validation.py
from marshmallow import Schema, fields, validate, ValidationError, EXCLUDE

class ContactVisibilitySchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    name = fields.Bool(load_default=True)
    email = fields.Bool(load_default=True)
    phone = fields.Bool(load_default=True)
    address = fields.Bool(load_default=True)

class ContactSchema(Schema):
    class Meta:
        unknown = EXCLUDE  # Ignore unknown fields
    
    name = fields.Str(validate=validate.Length(max=200), allow_none=True)
    email = fields.Str(validate=validate.Length(max=200), allow_none=True)
    phone = fields.Str(validate=validate.Length(max=50), allow_none=True)
    address = fields.Str(validate=validate.Length(max=500), allow_none=True)
    visibility = fields.Nested(ContactVisibilitySchema, load_default=lambda: {'name': True, 'email': True, 'phone': True, 'address': True})

class FieldVisibilitySchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    company = fields.Bool(load_default=True)
    jobTitle = fields.Bool(load_default=True)
    date = fields.Bool(load_default=True)
    hiringManager = fields.Bool(load_default=True)

class StyleSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    fontFamily = fields.Str(
        validate=validate.OneOf(['font-sans', 'font-serif', 'font-mono', 'font-roboto']),
        load_default='font-sans'
    )
    fontSize = fields.Float(
        validate=validate.Range(min=9, max=14),
        load_default=11
    )
    fontColor = fields.Str(
        validate=validate.Regexp(r'^#[0-9A-Fa-f]{6}$'),
        load_default='#000000'
    )
    lineSpacing = fields.Float(
        validate=validate.Range(min=1, max=2),
        load_default=1.5
    )
    margins = fields.Int(
        validate=validate.Range(min=4, max=16),
        load_default=8
    )
    paperSize = fields.Str(
        validate=validate.OneOf(['a4', 'letter']),
        load_default='a4'
    )
    headerAlignment = fields.Str(
        validate=validate.OneOf(['left', 'center', 'right']),
        load_default='left'
    )

class CoverLetterDataSchema(Schema):
    class Meta:
        unknown = EXCLUDE
    
    # Basic fields
    title = fields.Str(validate=validate.Length(max=200), required=True)
    templateId = fields.Str(validate=validate.Length(max=50), load_default='default')
    
    # Job information
    jobTitle = fields.Str(validate=validate.Length(max=200), allow_none=True)
    company = fields.Str(validate=validate.Length(max=200), allow_none=True)
    date = fields.Str(allow_none=True)  # ISO date string
    hiringManagerName = fields.Str(validate=validate.Length(max=200), allow_none=True)
    
    # Contact information
    contact = fields.Nested(ContactSchema, required=True)
    
    # Visibility settings
    visibility = fields.Nested(FieldVisibilitySchema, required=True)
    
    # Style settings
    style = fields.Nested(StyleSchema, required=True)
    
    # Content
    body = fields.Str(validate=validate.Length(max=10000), allow_none=True)
    
    # Additional metadata
    jobDescription = fields.Str(validate=validate.Length(max=5000), allow_none=True)
    aiPrompt = fields.Str(validate=validate.Length(max=500), allow_none=True)


def validate_cover_letter_data(data):
    """
    Validate cover letter data and return cleaned data or raise ValidationError
    """
    schema = CoverLetterDataSchema()
    return schema.load(data)
